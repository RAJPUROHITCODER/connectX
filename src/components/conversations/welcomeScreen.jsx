const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12 opacity-60 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2 text-white">No messages yet</h3>
      <p className="text-lg mb-8 max-w-md text-gray-400">Start typing to send your first message</p>
    </div>
  );
};

export default WelcomeScreen
