import axios from 'axios';
import Logger from '../utils/logger';

const API_KEY = process.env.NEWSDATA_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

export interface NewsArticle {
    article_id: string;
    title: string;
    link: string;
    keywords?: string[];
    creator?: string[];
    video_url?: string;
    description?: string;
    content?: string;
    pubDate: string;
    image_url?: string;
    source_id: string;
    category?: string[];
}

export const fetchNews = async (params: Record<string, any>) => {
    if (!API_KEY) {
        Logger.warn('NEWSDATA_API_KEY is not set');
        return [];
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                ...params,
                apikey: API_KEY,
                language: 'en', // Default to English
            }
        });

        if (response.data.status === 'success') {
            return response.data.results as NewsArticle[];
        } else {
            Logger.error(`NewsData API Error: ${JSON.stringify(response.data)}`);
            return [];
        }
    } catch (error) {
        Logger.error(`Failed to fetch news: ${error}`);
        return [];
    }
};
