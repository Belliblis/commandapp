A simple command-line app built with TypeScript that extracts text from image files using the OpenAI API.

Features
-Prompts user for image path
-Extracts visible text using OpenAI
-Logs results and errors to files
-Built with TypeScript and Yargs
-Tested with Jest

1.Clone the repo:
  git clone https://github.com/Belliblis/commandapp.git

2.Install dependencies:
  npm install

3.Add your OpenAI API key:
  Create a .env.local file with:
    API_KEY = your_api_key
    
4.Build app:
  tsc
  
5.Run app:
  npm start or node run image-to-text
  
6.Test app:
  npm test
