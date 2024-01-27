
process.on('unhandledRejection', (reason: Error, p) => {
    console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase());
    console.log('Reason: ', reason.stack ? String(reason.stack).gray : String(reason).gray);
    console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase());
});
process.on("uncaughtException", (err: Error, origin) => {
    console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase());
    console.log('Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase());
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('=== uncaught Exception Monitor ==='.toUpperCase());
});
process.on('beforeExit', (code) => {
    console.log('\n\n\n\n\n=== before Exit ==='.toUpperCase());
    console.log('Code: ', code);
    console.log('=== before Exit ===\n\n\n\n\n'.toUpperCase());
});
process.on('exit', (code) => {
    console.log('\n\n\n\n\n=== exit ==='.toUpperCase());
    console.log('Code: ', code);
    console.log('=== exit ===\n\n\n\n\n'.toUpperCase());
});
// process.on('multipleResolves', (type, promise, reason) => {
//     if(promise["url"]) return console.log("URL: ");
//     console.log('\n\n\n\n\n=== multiple Resolves ==='.toUpperCase());
//     console.log(type, promise, reason);
    
//     console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase());
// });

