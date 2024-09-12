const fs = require("fs");
const neo4j = require("neo4j-driver");
const dotenv = require("dotenv");
dotenv.config();
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function processFile() {
  let session;
  try {
    session = driver.session();

    const rawData = fs.readFileSync("./AllPrintings.json", "utf8");

    const jsonData = JSON.parse(rawData);

    if (jsonData.data) {
      for (const [setKey, setData] of Object.entries(jsonData.data)) {
        console.log(`Processing set: ${setKey}`);

        await insertDataIntoNeo4j(setData, session);
      }
    } else {
      console.error("No 'data' object found in the JSON file.");
    }
  } catch (err) {
    console.error("Error reading or processing the JSON file:", err);
  } finally {
    closeSessionAndDriver();
  }
}

async function insertDataIntoNeo4j(data, session) {
  const setQuery = `
    CREATE (s:Set {
      code: $code,
      name: $name,
      baseSetSize: $baseSetSize,
      releaseDate: $releaseDate,
      totalSetSize: $totalSetSize,
      type: $type
    })
  `;

  const cardQuery = `
    UNWIND $cards AS card
    CREATE (c:CardSet {
      uuid: card.uuid,
      name: card.name,
      manaValue: card.manaValue,
      convertedManaCost: card.convertedManaCost,
      rarity: card.rarity,
      type: card.type
    })
    WITH c, card  // Pass 'c' and 'card' to the next part of the query

    // Link colors
    UNWIND card.colors AS color
    MERGE (col:Color {name: color})
    CREATE (c)-[:HAS_COLOR]->(col)

    // Link rarity
    WITH c, card
    MERGE (r:Rarity {name: card.rarity})
    CREATE (c)-[:HAS_RARITY]->(r)

    // Link types
    WITH c, card
    UNWIND card.types AS type
    MERGE (t:Type {name: type})
    CREATE (c)-[:HAS_TYPE]->(t)

    // Link mana value
    WITH c, card
    MERGE (mv:ManaValue {value: card.manaValue})
    CREATE (c)-[:HAS_MANA_VALUE]->(mv)

    // Link artist
    WITH c, card
    MERGE (a:Artist {name: card.artist})
    CREATE (c)-[:HAS_ARTIST]->(a)

    // Link converted mana cost
    WITH c, card
    MERGE (cmc:ConvertedManaCost {value: card.convertedManaCost})
    CREATE (c)-[:HAS_CONVERTED_MANA_COST]->(cmc)
  `;

  const tx = session.beginTransaction();

  try {
    await tx.run(setQuery, {
      code: data.code,
      name: data.name,
      baseSetSize: data.baseSetSize,
      releaseDate: data.releaseDate,
      totalSetSize: data.totalSetSize,
      type: data.type,
    });

    await tx.run(cardQuery, { cards: data.cards });

    await tx.commit();
  } catch (error) {
    console.error("Error inserting data into Neo4j:", error);
    await tx.rollback();
  }
}

async function closeSessionAndDriver() {
  try {
    if (session) {
      await session.close();
    }
    await driver.close();
    console.log("Neo4j session and driver closed.");
  } catch (err) {
    console.error("Error closing session/driver:", err);
  }
}

processFile();
