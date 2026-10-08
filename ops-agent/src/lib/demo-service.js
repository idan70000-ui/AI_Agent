const BASE_URL = process.env.DEMO_SERVICE_URL || "https://localhost:3002";

export async function callDemoService(path) {
    const startData = Date.now();

    try {
        const response = await fetch(BASE_URL + path, {
            signal: AbortSignal.timeout(3000),
        });
        const body = await response.json();
        console.log(body);
        return { httpStatus: response.status, ms: Date.now() - startData, body };
    } catch (error) {
        console.error("Error calling demo service:", error);
        return { httpStatus: 500, ms: Date.now() - startData, body: { error: error.message } };
        throw error;
    }
}