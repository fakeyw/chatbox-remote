/// <reference path="../pb_data/types.d.ts" />

onRecordsListRequest((e) => {
    try {
        const collectionName = e.collection ? e.collection.name : "未知表";
        let identity = "Guest";

        const authRecord = e.auth; 
        const admin = e.admin;

        if (authRecord) {
            const email = authRecord.getString ? authRecord.getString("email") : "N/A";
            identity = `User: ${authRecord.id} (${email})`;
        } else if (admin) {
            identity = `Admin: ${admin.email}`;
        }

        console.log(`[AUDIT] List -> ${collectionName.padEnd(10)} | User: ${identity}`);
    } catch (err) {
        console.log("[AUDIT] List Error:", err);
    }

    return e.next();
});

onRecordViewRequest((e) => {
    try {
        const collectionName = e.collection ? e.collection.name : "Unknown collection";
        const recordId = e.record ? e.record.id : "Unknown ID";
        let identity = "Guest";

        const authRecord = e.auth;
        const admin = e.admin;

        if (authRecord) {
            identity = `User: ${authRecord.id}`;
        } else if (admin) {
            identity = `Admin: ${admin.email}`;
        }
        
        console.log(`[AUDIT] View -> ${collectionName} | ID: ${recordId} | User: ${identity}`);
    } catch (err) {
        console.log("[AUDIT] View Error:", err);
    }

    return e.next();
});