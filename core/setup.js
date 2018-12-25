import extract from "extract-zip";
import { cwd } from "../config/folder";

export async function extractTasks(filePath) {
    extract(filePath, { dir: cwd }, err => {
        if (err) throw err;
    });
}
