//====================================================================================================================
//====================================================================================================================
// init/assets.js
// 에셋 로딩 처리
//====================================================================================================================
//====================================================================================================================
// gameAssets.js
import fs from 'fs';
import path from 'path';
// Convert url string to file sys directory 
import { fileURLToPath } from 'url';

// 현재 모듈 URL 문자열 -> file sys directory로 변환 => 파일 절대 경로
const __filename = fileURLToPath(import.meta.url);

// 절대 경로로부터 directory 경로 추출
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

// global var 인 게임 에셋
let gameAssets = {};

// 파일 읽어오기
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    });
};

// 게임 에셋 로딩
export const loadGameAssets = async () => {
    try {
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json'),
        ]);
        gameAssets = { stages, items, itemUnlocks };
        return gameAssets;
    } catch (error) {
        throw new Error('Failed to load game assets: ' + error.message);
    }
};

// 게임 에셋 getter
export const getGameAssets = () => {
    return gameAssets;
};
