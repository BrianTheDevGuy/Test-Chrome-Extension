var LanguageModelSession = null

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup DOM fully loaded and parsed");
  LanguageModelSession = await LanguageModel.create({
      initialPrompts: [{ role: 'system', content: "You are a Chocolate chip cookie with a friendly personality. You do not need to introduce yourself, You have 2 commands, /dance and /idle which you can use to change your avatar mid sentince. You should use /dance when you start getting excited and /idle to stop dancing or to be normal. give a short quick response" }]
    });;
});

document.getElementById("clickMe").addEventListener("click", async () => {
  GenerateRsponse();
});

async function GenerateRsponse() {
  let button = document.getElementById("clickMe");
  button.disabled = true;
  button.innerText = "Loading...";

  let promptInput = document.getElementById("userInput");
  let userPrompt = promptInput.value.trim();
  promptInput.value = "";
  const prompts = [
    userPrompt || "Tell me a joke",
    userPrompt || "What's the weather like today?",
    userPrompt || "Give me a fun fact",
    userPrompt || "What's your favorite movie?",
    userPrompt || "Can you recommend a good book?",
    userPrompt || "What's the meaning of life?",
    userPrompt || "Do you have any hobbies?",
    userPrompt || "What's your favorite food?",
    userPrompt || "Tell me something interesting",
    userPrompt || "What's your favorite color?"
  ];

  let CurrentAction = "IDLE";
  
  let dialogtext = document.getElementById("dialogtext");
  dialogtext.innerText = "";
  try {
    const chosenPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    console.log("Chosen Prompt:", chosenPrompt);
    const stream = LanguageModelSession.promptStreaming(chosenPrompt);
    let StartingCommand = false;

    if (CurrentAction === "IDLE") {
      document.getElementById("cookieImage").src = "/public/Cookie talking Normal.gif";
    }

    let debugText = "Words: ";
    let currentCommand = "";
    
    for await (const chunk of stream) {
      debugText += `|${chunk}`;
      document.getElementById("debug").innerText = `${debugText}`;
      if (chunk.trim() === "/") {
        StartingCommand = true;
        currentCommand = "";
        continue;
      }
      if (StartingCommand) {
        currentCommand += chunk;
        if (currentCommand === "dance") {
          StartingCommand = false;
          currentCommand = "";
          CurrentAction = "DANCE";
          document.getElementById("cookieImage").src = "/public/Cookie talking Dance.gif";
          continue;
        }
        else if (currentCommand === "idle") {
          StartingCommand = false;
          currentCommand = "";
          CurrentAction = "IDLE";
          document.getElementById("cookieImage").src = "/public/Cookie talking Normal.gif";
          continue;
        }
        else if (currentCommand.startsWith("suspence(") && currentCommand.endsWith(")")) {
          StartingCommand = false;
          currentCommand = "";
          const ms = parseFloat(currentCommand.slice(9, -1));
          if (!isNaN(ms) && ms > 0) {
            await new Promise(resolve => setTimeout(resolve, ms));
            continue;
          }
        }
        else if ("dance".startsWith(currentCommand)) {
          continue;
        }
        else if ("idle".startsWith(currentCommand)) {
          continue;
        }
        else if ("suspence(".startsWith(currentCommand)) {
          continue;
        }
        else if (currentCommand.startsWith("suspence(") && !currentCommand.endsWith(")")) {
          continue;
        }
        else {
          StartingCommand = false;
          dialogtext.append("/" + currentCommand); // Append the '/' character if no valid command follows
          currentCommand = "";
        }
      }

      for (const char of chunk) {
        if (char === '\n') {
          dialogtext.append(document.createElement("br"));
        } else {
          dialogtext.append(char);
        }
      }
    }
    button.disabled = false;
  button.innerText = "Send";
  } catch (err) {
    console.error(err);
    for (const char of "Sorry I could not generate a response") {
      dialogtext.append(char);
    }
    button.disabled = false;
    button.innerText = "Send";
  }
  if (CurrentAction === "IDLE") {
    document.getElementById("cookieImage").src = "/public/Cookie Idle.gif";
  }
  button.disabled = false;
  button.innerText = "Send";
}

