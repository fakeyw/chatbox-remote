/// <reference path="../pb_data/types.d.ts" />

onBootstrap((e) => {
    e.next();

    console.log("-----------------------------------------");
    console.log("[Chatbox] App initialized. Running setup...");

    try {
        $app.findCollectionByNameOrId("storage");
    } catch (err) {
        console.log("[Chatbox] Creating 'storage' collection...");
        
        const collection = new Collection();
        collection.name = "storage";
        collection.type = "base";

        collection.fields.add(new Field({
            name: "key",
            type: "text",
            required: true
        }));
        collection.fields.add(new Field({
            name: "value",
            type: "text",
            required: false,
            max: 1000000
        }));
        collection.fields.add(new Field({
            name: "created",
            type: "autodate",
            onCreate: true,
        }));
        collection.fields.add(new Field({
            name: "updated",
            type: "autodate",
            onCreate: true,
            onUpdate: true,
        }));

        collection.listRule = "@request.auth.id != ''";
        collection.viewRule = "@request.auth.id != ''";
        collection.createRule = "@request.auth.id != ''";
        collection.updateRule = "@request.auth.id != ''";
        collection.deleteRule = "@request.auth.id != ''";

        collection.indexes = ["CREATE UNIQUE INDEX idx_key ON storage (key)"];

        try {
            $app.save(collection);
            console.log("[Chatbox] Collection 'storage' created.");
        } catch (dbErr) {
            console.log("[Chatbox] Failed to create collection:", dbErr);
        }
    }

    const botEmail = "bot@chatbox.local";
    try {
        $app.findAuthRecordByEmail("users", botEmail);
    } catch (err) {
        console.log("[Chatbox] Creating bot user...");
        try {
            const users = $app.findCollectionByNameOrId("users");
            const record = new Record(users);
            record.setEmail(botEmail);
            record.setPassword($security.randomString(30));
            
            $app.save(record);
            console.log("[Chatbox] Bot user created.");
        } catch (dbErr) {
             console.log("[Chatbox] Failed to create bot user:", dbErr);
        }
    }
    
    console.log("[Chatbox] Setup finished.");
    console.log("-----------------------------------------");
})

const handleIndex = (e) => {
    try {
        e.response.header().set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        e.response.header().set("Pragma", "no-cache");

        let hasAuth = false;
        try {
            const cookie = e.request.cookie("pb_auth_access");
            const val = cookie.Value || cookie.value; 
            
            if (val) {
                hasAuth = true;
            }
        } catch (err) {
            console.log("No auth cookie found.");
        }

        let targetFile = "pb_public/login.html"; 
        
        if (hasAuth) {
            targetFile = "pb_public/dash.html"; 
        }

        const html = $template.loadFiles(targetFile).render();
        return e.html(200, html);

    } catch (err) {
        return e.string(500, "Internal Server Error: " + err.toString());
    }
};

// hijack
routerAdd("GET", "/{$}", handleIndex);
routerAdd("GET", "/settings", handleIndex);
routerAdd("GET", "/session", handleIndex);
routerAdd("GET", "/copilots", handleIndex);
routerAdd("GET", "/about", handleIndex); 
routerAdd("GET", "/session/{path...}", handleIndex); 

routerAdd("GET", "/login", (c) => {
    try {
        const html = $template.loadFiles("pb_public/login.html").render();
        return c.html(200, html);
    } catch (err) {
        console.error("Error in /login:", err);
        return c.string(500, "Login page error: " + err.message);
    }
});

routerAdd("GET", "/login.html", (c) => {
    return c.redirect(307, "/login");
});

routerAdd("POST", "/api/chatbox-auth", (c) => {
    try {
        const secret = $os.getenv("ACCESS_SECRET");
        
        const data = new DynamicModel({
            password: "",
        });

        try {
            c.bindBody(data);
        } catch (e) {
            console.log("Bind warning:", e);
        }

        const submittedPassword = data.password;
        
        console.log("[Received password length:", submittedPassword ? submittedPassword.length : 0);
        if (!secret || submittedPassword !== secret) {
            console.log("Auth failed: Invalid password");
            return c.json(401, { message: "Invalid password" });
        }

        console.log("Auth success, finding bot user...");
        const botUser = $app.findAuthRecordByEmail("users", "bot@chatbox.local");
        
        const token = botUser.newAuthToken();

        c.setCookie({
            name: "pb_auth_access", 
            value: "true", 
            path: "/", 
            secure: true, 
            httpOnly: true, 
            sameSite: "Lax", 
            maxAge: 2592000
        });

        return c.json(200, { token: token, user: botUser });

    } catch (err) {
        console.error("API Critical Error:", err);
        return c.json(500, { message: err.message });
    }
});