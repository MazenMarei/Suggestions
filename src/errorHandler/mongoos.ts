import mongoose from "mongoose";

mongoose.connection.on('error', (err) => {
    console.log('\n\n\n\n\n=== Mongoos Error ==='.toUpperCase());
    console.log(err);
    console.log('\n\n\n\n\n=== Mongoos Error ==='.toUpperCase());

});