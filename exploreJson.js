const fs = require('fs');

function exploreJsonFile() {
  try {
    // Read the file
    const rawData = fs.readFileSync('./AllPrintings.json', 'utf8');
    
    // Parse the JSON data
    const jsonData = JSON.parse(rawData);

    // Explore basic information
    if (jsonData.data) {
      console.log("The JSON contains the following sets:");
      const setKeys = Object.keys(jsonData.data);
      console.log(setKeys.slice(0, 10)); // Display first 10 set keys for brevity

      // Explore one set in detail
      const sampleSet = jsonData.data[setKeys[0]];
      console.log(`Exploring set: ${setKeys[0]}`);
      console.log(`Set Name: ${sampleSet.name}`);
      console.log(`Total cards in set: ${sampleSet.cards.length}`);
      console.log(`Release Date: ${sampleSet.releaseDate}`);
      
      // Explore first few cards
      console.log("First 3 cards:");
      console.log(sampleSet.cards.slice(0, 3));

    } else {
      console.error("No 'data' object found in the JSON file.");
    }
  } catch (err) {
    console.error("Error reading or processing the JSON file:", err);
  }
}

exploreJsonFile();
