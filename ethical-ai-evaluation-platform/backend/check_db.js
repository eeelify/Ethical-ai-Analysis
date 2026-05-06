const mongoose = require('mongoose');
const uri = 'mongodb+srv://pelingilik1_db_user:3xRZTvbFo3G0nv9E@newcluster.xkwdoub.mongodb.net/?appName=NewCluster';

async function run() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to DB.");
    const db = mongoose.connection.db;

    const tensions = await db.collection('tensions').find({}).toArray();
    console.log("Total tensions in DB:", tensions.length);
    if (tensions.length > 0) {
      console.log("Sample tension projectId:", tensions[0].projectId, "Type:", typeof tensions[0].projectId, tensions[0].projectId instanceof mongoose.Types.ObjectId ? "ObjectId" : "");
    }

    const projects = await db.collection('projects').find({}).toArray();
    console.log("Total projects in DB:", projects.length);
    if (projects.length > 0) {
      console.log("Sample project _id:", projects[0]._id, "Type:", typeof projects[0]._id, projects[0]._id instanceof mongoose.Types.ObjectId ? "ObjectId" : "");
    }

  } catch (err) {
    console.error("Connection error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
