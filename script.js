// ===========================
// Gemini API Key
// ===========================

const API_KEY = "Enter Api Key";

// ===========================

const topic = document.getElementById("topic");
const storyType = document.getElementById("storyType");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const story = document.getElementById("story");

generateBtn.addEventListener("click", generateStory);
copyBtn.addEventListener("click", copyStory);

async function generateStory() {

    if (topic.value.trim() === "") {
        alert("Please enter a story topic.");
        return;
    }

    story.innerHTML = "Generating story...";

    const prompt = `
Write a ${storyType.value} story in 100-200 words.

Topic: ${topic.value}

Rules:
- Use simple English.
- Make it interesting.
- Give it a satisfying ending.
- Do not use headings.
`;

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            story.innerHTML = data.error?.message || "Request Failed!";
            return;
        }

        story.innerHTML =
            data.candidates[0].content.parts[0].text;

    } catch (error) {

        console.log(error);
        story.innerHTML = "Something went wrong.";

    }

}

function copyStory() {

    navigator.clipboard.writeText(story.innerText);

    alert("Story copied!");

}