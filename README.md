
### README for MTGJSON AllPrintings Parsing and Neo4j Batch Upload Script

---

#### Project Overview

This project provides a Node.js script specifically designed to parse **MTGJSON's AllPrintings.json** file and batch upload Magic: The Gathering card data into a Neo4j graph database. The script efficiently processes large, nested JSON files and uploads card data, sets, and related information into Neo4j for the purpose of developing a graph database of all Magic: The Gathering cards.

The AllPrintings file contains comprehensive information about all Magic: The Gathering cards, including set information, card attributes, rarities, and more. This script helps to organize this data into a graph structure, enabling deeper analysis and exploration of the Magic: The Gathering card universe.

#### Features

- **Specifically Built for MTGJSON's AllPrintings.json**: Optimized to handle the structure and format of MTGJSON’s AllPrintings data.
- **Efficient Parsing**: Processes the large and nested AllPrintings.json file in memory.
- **Batch Uploads**: Data is uploaded to Neo4j in batches to prevent memory overload and improve performance.
- **Customizable**: Uses environment variables to configure Neo4j database credentials, making it easy to adapt to different setups.
- **Flexible Data Model**: Captures relationships between cards, sets, colors, rarities, and other attributes to create a rich graph database.

---

#### Requirements

- **Node.js**: This script requires Node.js to be installed on your machine.
- **Neo4j Database**: A running instance of Neo4j, either locally or on a server.
- **Environment Variables**: The following environment variables must be defined in a `.env` file to establish a connection with Neo4j:
  - `NEO4J_URI`: The URI of your Neo4j instance (e.g., `bolt://localhost:7687`).
  - `NEO4J_USER`: The Neo4j username (usually `neo4j`).
  - `NEO4J_PASSWORD`: The Neo4j password.

---

#### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd jsonReader-master
   ```

2. **Install Dependencies**:
   Run the following command to install the required Node.js packages:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root of the project with the following contents:
   ```bash
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=yourpassword
   ```

---

#### Usage

1. **Download the AllPrintings JSON File**:
   Download the `AllPrintings.json` file from the [MTGJSON website](https://mtgjson.com/downloads/all-files/#allprintings). Ensure that the JSON file is located in the root directory of the project.

2. **Run the Script**:
   To run the script and start processing the AllPrintings.json file, use the following command:
   ```bash
   node script.js
   ```

   The script will parse the AllPrintings.json file and upload the data in batches to the Neo4j database.

---

#### How It Works

- **Processing the File**: 
  The `processFile()` function reads the `AllPrintings.json` file and parses it. It then iterates through the sets of data found in the `data` object, processing each set and uploading it to the Neo4j database using the `insertDataIntoNeo4j()` function.

- **Uploading Data**:
  The `insertDataIntoNeo4j()` function inserts each set of data (such as card sets) into the Neo4j database. It creates nodes for the sets, along with related information such as cards, colors, rarities, and more, using Cypher queries.

- **Optimized for AllPrintings.json**:
  This script is tailored to handle the specific structure of the AllPrintings.json file, ensuring that the vast amount of Magic: The Gathering data is properly organized in a graph format in Neo4j.

---

#### Important Files

- **`script.js`**: The main script responsible for parsing the JSON file and interacting with the Neo4j database.
- **`package.json`**: Contains the project metadata and lists dependencies.
- **`.env`**: Used to store sensitive information such as Neo4j credentials (not included in the repository).
- **`AllPrintings.json`**: [MTGJSON AllPrintings](#mtgjson-allprintingsjson)

---

#### Troubleshooting

- **Neo4j Connection Issues**: 
  Ensure that your Neo4j instance is running and the URI, username, and password in your `.env` file are correct.

- **Neo4j Free Tier Scaling Issues**: 
  Neo4j Free Tier allows for 200000 Nodes. Some sources estimate that there are around 90,000 unique MTG cards when you include reprints, variants, and "out of game" cards. Scaling issues arise when creating relationships for each unique card as Neo4j allows for 400000 Relations.

- **Memory Limitations**:
  If you're working with extremely large JSON files, ensure that your system has sufficient memory, or consider streaming the data in smaller chunks if necessary.

---

#### MTGJSON AllPrintings.json

The `AllPrintings.json` file is a comprehensive resource provided by MTGJSON that includes data about every Magic: The Gathering card, set, and related attributes. This script was created specifically to assist in the development of a graph database using this data, allowing for deeper exploration of card relationships and Magic: The Gathering history.

You can download the AllPrintings JSON file from [MTGJSON's website](https://mtgjson.com/downloads/all-files/#allprintings).

---

This script is highly customizable and can be adapted to various use cases involving large-scale Magic: The Gathering data migration into a Neo4j graph database.
