import OpenAI from "openai";

export const exctractTextFromImage = async(imageDataURL:string, apiKey:string):Promise<string|null>=>{
    try{
        const openAi = new OpenAI({apiKey:apiKey});
        const result = await openAi.chat.completions.create({
            model: 'gpt-4o', 
            messages:[
                {
                    role:'user', 
                    content:[
                        {type:'text', text: 'Extract the full text from the image and return a list of key searchable terms based on the content. Include names, numbers, titles, or anything a user might search for. Key words should be presented in two languages: russian and english. Group them by language. First line if text was found should be Текст, обнаруженный на изображении: . If image contained text return text in language that i was present in image, if no text was found - return description of image and use Russian language to describe it dont forget to include phrase: Текст на изображении обнаружен не был, if you have any comments regarding contents of image use Russian language.'}, 
                        {type:'image_url', image_url:{url:imageDataURL}}
                    ]
                }
            ], 
        max_tokens:300
        })  
        if(result && result.choices && result.choices[0]?.message?.content){
            return result.choices[0].message.content
        } else {
            throw new Error(`No valid content returned from OpenAi`)
        }
        
    } catch (error) {
        throw new Error(`Failed to exctract text from image. ${error}`)
    }
    
}
