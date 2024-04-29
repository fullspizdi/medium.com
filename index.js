const { GoogleAIStudio } = require('google-ai-studio');
const { Medium } = require('medium-sdk-nodejs-master');

const gemini = new GoogleAIStudio({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'text-davinci-003'
});

const medium = new Medium({ 
  accessToken: process.env.MEDIUM_ACCESS_TOKEN
});

async function generateAndPostArticle() {
  try {
    // Generate article title
    const titlePrompt = "Generate a catchy title for a blog post";
    const title = await gemini.complete(titlePrompt);

    // Generate article image 
    const imagePrompt = `Generate an image description for the blog post titled "${title}"`;
    const imageDesc = await gemini.complete(imagePrompt);
    const image = await gemini.generateImage(imageDesc);

    // Generate article body
    const bodyPrompt = `Write a 500 word blog post with the title "${title}"`;
    const body = await gemini.complete(bodyPrompt);

    // Post to Medium
    await medium.createPost({
      title: title,
      contentFormat: 'html',
      content: `<img src="${image}" /><p>${body}</p>`,
      publishStatus: 'public'
    });

    console.log('Article generated and posted successfully');

  } catch (err) {
    console.error(err);
  }
}

setInterval(generateAndPostArticle, 60 * 60 * 1000); // Run every 60 minutes


