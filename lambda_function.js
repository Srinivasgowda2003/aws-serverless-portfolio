import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  
  // --- PART 1: HANDLING "POST" (Saving Messages) ---
  if (event.requestContext && event.requestContext.http && event.requestContext.http.method === "POST") {
    try {
      const body = JSON.parse(event.body);
      const command = new PutCommand({
        TableName: "MyContactTable",
        Item: {
          id: Date.now().toString(),
          message: body.message,
          date: new Date().toISOString()
        },
      });
      await docClient.send(command);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Message saved successfully!" }),
        headers: { "Content-Type": "application/json" }
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  // --- PART 2: HANDLING "GET" (Reading Messages) ---
  let msgHtml = "<p>No messages yet.</p>";
  try {
    const data = await docClient.send(new ScanCommand({ TableName: "MyContactTable" }));
    const msgs = data.Items ? data.Items.filter(item => item.message) : [];
    
    if (msgs.length > 0) {
      // Sort messages by ID (newest last) or reverse if you prefer
      msgs.sort((a, b) => b.id - a.id); 
      
      msgHtml = msgs.map(m => `
        <div style="background: rgba(255,255,255,0.05); margin-top: 10px; padding: 10px; border-radius: 5px; border-left: 3px solid #00d2ff; text-align: left;">
           <span style="color: #888; font-size: 0.8em;">Guest says:</span><br>
           <strong style="color: #fff;">${m.message}</strong>
        </div>
      `).join('');
    }
  } catch (err) {
    console.log("Error reading DB:", err);
  }

  // --- PART 3: THE HTML WEBSITE ---
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Srinivas G - Cloud Portfolio</title>
    <style>
      body { background: #0f0f0f; color: #fff; font-family: sans-serif; margin: 0; padding: 20px; text-align: center; }
      .container { max-width: 600px; margin: auto; }
      .card { background: #1a1a1a; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); margin-bottom: 20px; }
      h1 { margin: 10px 0; color: #fff; }
      h2 { color: #00d2ff; border-bottom: 2px solid #333; padding-bottom: 10px; margin-top: 0; }
      p { color: #aaa; line-height: 1.6; }
      .btn { display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 25px; text-decoration: none; font-weight: bold; cursor: pointer; }
      .btn-github { background: #333; color: white; border: 1px solid rgba(255,255,255,0.3); }
      .btn-insta { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #8a3ab9); color: white; border: none; }
      input { padding: 10px; width: 70%; border-radius: 5px; border: none; margin-right: 5px; }
      button.send { padding: 10px 20px; background: #00d2ff; color: #000; border: none; font-weight: bold; border-radius: 5px; cursor: pointer; }
      .project { background: #252525; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: left; }
      .project h3 { margin: 0 0 5px 0; color: #ff9900; }
    </style>
  </head>
  <body>
    <div class="container">
      
      <div class="card">
        <img src="https://via.placeholder.com/150" alt="Profile" style="border-radius: 50%; width: 100px; height: 100px; border: 3px solid #00d2ff;">
        <h1>Srinivas G</h1>
        <p style="color: #00d2ff;">Cloud & DevOps Aspirant</p>
        <p>Working hard in a factory by day, building cloud infrastructure by night. Passionate about AWS, Python, and Linux.</p>

        <div style="margin-top: 20px; display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
            <a href="https://github.com/Srinivasgowda2003" target="_blank" class="btn btn-github">🐱 GitHub</a>
            <a href="https://instagram.com/developers_mind" target="_blank" class="btn btn-insta">📸 Instagram</a>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #333; padding-top: 20px;">
           <h3>🖊️ Sign My Guestbook</h3>
           <div style="display: flex; justify-content: center;">
             <input type="text" id="msg" placeholder="Write a message...">
             <button class="send" onclick="fetch('/', {method:'POST', body: JSON.stringify({message: document.getElementById('msg').value})}).then(r=>r.json()).then(d=>{ alert(d.message); location.reload(); })">Send</button>
           </div>
           
           <div style="margin-top: 20px;">
              ${msgHtml}
           </div>
        </div>
      </div> <div class="card">
        <h2>🚀 Projects</h2>
        
        <div class="project">
          <h3>☁️ Serverless Portfolio (This Site)</h3>
          <p>Built with AWS Lambda, API Gateway, and DynamoDB. Fully serverless and scalable.</p>
        </div>

        <div class="project">
          <h3>🔐 CloudVault (Coming Soon)</h3>
          <p>A secure file sharing tool using S3 Presigned URLs and Python Boto3.</p>
        </div>
      </div>

      <div class="card">
         <h2>📄 Resume</h2>
         <p><strong>Education:</strong> BCA Graduate</p>
         <p><strong>Certifications:</strong> AWS Cloud Practitioner (In Progress)</p>
         <p><strong>Skills:</strong> Python, Linux, AWS (EC2, S3, Lambda), SQL</p>
      </div>

    </div>
  </body>
  </html>
  `;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html,
  };
};
