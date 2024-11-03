// Function to report web vitals if a callback function is provided
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import web vitals and pass metrics to the callback
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);   // Cumulative Layout Shift (visual stability)
      getFID(onPerfEntry);   // First Input Delay (interactivity)
      getFCP(onPerfEntry);   // First Contentful Paint (loading speed)
      getLCP(onPerfEntry);   // Largest Contentful Paint (loading performance)
      getTTFB(onPerfEntry);  // Time to First Byte (server response)
    });
  }
};

// Export function for use elsewhere
export default reportWebVitals;
