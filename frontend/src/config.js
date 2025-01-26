const config = {
    API_HOST: 'localhost',
    API_SECURE: false,
    API_PORT: 8000,

    get API_URL() {
        return `${this.API_SECURE ? 'https' : 'http'}://${this.API_HOST}:${this.API_PORT}`;
    }
}

export default config;