// OpenWeatherMap API Key
const WEATHER_API_KEY = "Enter_Your_Key";

const NEWS_API_KEY = "Enter_Your_Key";

// Gemini API Key
const GEMINI_API_KEY = "Enter_Your_Key";



// ================= WEATHER =================

async function getWeather() {

    const city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Enter City Name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod != 200) {
            document.getElementById("weather").innerHTML = "City Not Found";
            return;
        }

        document.getElementById("weather").innerHTML = `
            <h3>${data.name}</h3>
            <p>🌡 Temperature : ${data.main.temp} °C</p>
            <p>☁ Weather : ${data.weather[0].main}</p>
            <p>📝 Description : ${data.weather[0].description}</p>
            <p>💧 Humidity : ${data.main.humidity}%</p>
            <p>💨 Wind : ${data.wind.speed} m/s</p>
        `;

    } catch (error) {
        document.getElementById("weather").innerHTML = "Error loading weather.";
        console.log(error);
    }

}



// ================= NEWS =================

let newsText = "";

async function getNews() {

    const url = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=5&apikey=${NEWS_API_KEY}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        let output = "";

        newsText = "";

        data.articles.forEach(article => {

            newsText += article.title + "\n";

            output += `
                <div class="news-item">
                    <a href="${article.url}" target="_blank">
                        ${article.title}
                    </a>

                    <p>${article.description || ""}</p>
                </div>
            `;

        });

        document.getElementById("news").innerHTML = output;

    } catch (error) {

        document.getElementById("news").innerHTML = "Unable to load news.";

        console.log(error);

    }

}

// ================= GEMINI AI SUMMARY =================

async function generateSummary() {

    if (newsText.trim() === "") {
        alert("Pehle News Load karo.");
        return;
    }

    document.getElementById("summary").innerHTML = "Generating AI Summary...";

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
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
                                    text: `Summarize these news headlines in simple 5-6 lines:\n\n${newsText}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const summary =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No summary generated.";

        document.getElementById("summary").innerHTML = summary;

    } catch (error) {

        console.log(error);

        document.getElementById("summary").innerHTML =
            "Error generating AI summary.";

    }

}