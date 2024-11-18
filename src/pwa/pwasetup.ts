
if ('serviceWorker' in navigator) {
  // why cant i figure out how to dynmically import this
  navigator.serviceWorker.register('/blockit/serviceworker.js')
  .then(() => {
    console.log('Service Worker registered successfully.');
  })
  .catch(error => {
    console.log('Service Worker registration failed:', error);
  });
}