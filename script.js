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

    // Parse the JSON file
    const jsonData = JSON.parse(rawData);

    // Check if 'data' field exists in the JSON
    if (jsonData.data) {
      console.log(`Total number of sets: ${Object.keys(jsonData.data).length}`);

      // Loop through each set
      for (const [setKey, setData] of Object.entries(jsonData.data)) {
        console.log(`Processing set: ${setKey}`);

        // Handle potential errors in specific set insertion
        try {
          await insertDataIntoNeo4j(setData, session);
          console.log(`Successfully inserted set: ${setKey}`);
        } catch (err) {
          console.error(`Error inserting set: ${setKey}`, err);
        }
      }
    } else {
      console.error("No 'data' object found in the JSON file.");
    }
  } catch (err) {
    console.error("Error reading or processing the JSON file:", err);
  } finally {
    await closeSessionAndDriver();
  }
}

async function insertDataIntoNeo4j(data, session) {
  const setQuery = `
    CREATE (s:Set {
      code: $code,
      name: $name,
      releaseDate: $releaseDate,
      totalSetSize: $totalSetSize
    })
  `;

  const cardQuery = `
    UNWIND $cards AS card
    MATCH (s:Set {code: $setCode})  // Find the set this card belongs to
    CREATE (c:CardSet {
      uuid: card.uuid,
      name: card.name,
      manaValue: CASE WHEN card.manaValue IS NULL THEN 0 ELSE card.manaValue END,
      convertedManaCost: CASE WHEN card.convertedManaCost IS NULL THEN 0 ELSE card.convertedManaCost END,
      rarity: card.rarity,
      type: card.type,
      borderColor: card.borderColor,
      frameVersion: card.frameVersion,
      hasFoil: card.hasFoil,
      hasNonFoil: card.hasNonFoil
    })
    CREATE (c)-[:BELONGS_TO]->(s)  // Create relationship between CardSet and Set

    // Link colors only (ignoring colorIdentity)
    WITH c, card
    FOREACH (color IN CASE WHEN card.colors IS NOT NULL THEN card.colors ELSE [] END |
      MERGE (col:Color {name: color})
      CREATE (c)-[:HAS_COLOR]->(col)
    )

    // Link rarity
    WITH c, card
    MERGE (r:Rarity {name: card.rarity})
    CREATE (c)-[:HAS_RARITY]->(r)

    // Link types, subtypes, supertypes
    WITH c, card
    FOREACH (type IN CASE WHEN card.types IS NOT NULL THEN card.types ELSE [] END |
      MERGE (t:Type {name: type})
      CREATE (c)-[:HAS_TYPE]->(t)
    )
    FOREACH (subtype IN CASE WHEN card.subtypes IS NOT NULL THEN card.subtypes ELSE [] END |
      MERGE (st:Subtype {name: subtype})
      CREATE (c)-[:HAS_SUBTYPE]->(st)
    )
    FOREACH (supertype IN CASE WHEN card.supertypes IS NOT NULL THEN card.supertypes ELSE [] END |
      MERGE (sup:Supertype {name: supertype})
      CREATE (c)-[:HAS_SUPERTYPE]->(sup)
    )

    // Link artist
    WITH c, card
    FOREACH (artist IN CASE WHEN card.artist IS NOT NULL THEN [card.artist] ELSE [] END |
      MERGE (a:Artist {name: artist})
      CREATE (c)-[:HAS_ARTIST]->(a)
    )

    // Optional fields (flavorText, originalText, power, etc.)
    WITH c, card
    FOREACH (flavorText IN CASE WHEN card.flavorText IS NOT NULL THEN [card.flavorText] ELSE [] END |
      SET c.flavorText = flavorText
    )
    FOREACH (originalText IN CASE WHEN card.originalText IS NOT NULL THEN [card.originalText] ELSE [] END |
      SET c.originalText = originalText
    )
    FOREACH (power IN CASE WHEN card.power IS NOT NULL THEN [card.power] ELSE [] END |
      SET c.power = power
    )
    FOREACH (toughness IN CASE WHEN card.toughness IS NOT NULL THEN [card.toughness] ELSE [] END |
      SET c.toughness = toughness
    )
    FOREACH (loyalty IN CASE WHEN card.loyalty IS NOT NULL THEN [card.loyalty] ELSE [] END |
      SET c.loyalty = loyalty
    )

    // Link keywords
    WITH c, card
    FOREACH (keyword IN CASE WHEN card.keywords IS NOT NULL THEN card.keywords ELSE [] END |
      MERGE (kw:Keyword {name: keyword})
      CREATE (c)-[:HAS_KEYWORD]->(kw)
    )
  `;

  const tx = session.beginTransaction();

  try {
    // Insert Set data
    await tx.run(setQuery, {
      code: data.code,
      name: data.name,
      totalSetSize: data.totalSetSize,
      releaseDate: data.releaseDate,
    });

    // Insert Card data in batches for better performance
    const batchSize = 1000;
    let cardBatch = [];
    for (const card of data.cards) {
      cardBatch.push(card);
      if (cardBatch.length === batchSize) {
        await tx.run(cardQuery, { cards: cardBatch, setCode: data.code });
        cardBatch = []; // Reset batch
      }
    }

    // Insert remaining cards
    if (cardBatch.length > 0) {
      await tx.run(cardQuery, { cards: cardBatch, setCode: data.code });
    }

    await tx.commit(); // Commit transaction
  } catch (error) {
    console.error("Error inserting data into Neo4j:", error);
    await tx.rollback(); // Rollback on error
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
