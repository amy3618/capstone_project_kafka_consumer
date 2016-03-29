module.exports = {
  SERVER_URL: "https://salty-depths-35522.herokuapp.com",
  // Number of messages per batch
  SERVER_REQUEST_NUM_MESSAGES: 3,
  // Server poll rate (per topic) In ms
  SERVER_REQUEST_RATE: 1000,

  // Max messages to store per topic
  MESSAGE_STORE_MAX_MESSAGES: 1000,
  // In ms
  MESSAGE_BUFFER_TIME: 0,

  // In pixels / ms
  MOUSE_RUN_SPEED: 5,
  // In pixels
  CHEESE_LEFT_OFFSET: 200,
  // Approximate message width In pixels
  MESSAGE_WIDTH: 200,
  
  // Calculate incoming message rate over this period (seconds)
  MESSAGE_RATE_CALC_TIME: 20,
  
  // How often should the message rate be updated (ms)
  // Message rate is automatically updated when a new message arrives 
  // regardless of this
  // BE CAREFUL OF SETTING THIS TOO LOW OR THINGS MAY START TO SLOW DOWN 
  MESSAGE_UPDATE_RATE: 10000,
  
  // Determine whether message appear in chronological or
  // reverse chronological order
  CHRONOLOGICAL_ORDER: false,
  
  // Language (choose between French and English) (defaults to English)
  LANGUAGE : {
    ENGLISH: true,
    FRENCH: false
  }
}
