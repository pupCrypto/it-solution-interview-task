const config = {
    REACT_APP_API_HOST: 'localhost',
    REACT_APP_API_SECURE: false,
    REACT_APP_API_PORT: 8000,

    get API_URL() {
        return `${this.REACT_APP_API_SECURE ? 'https' : 'http'}://${this.REACT_APP_API_HOST}:${this.REACT_APP_API_PORT}`;
    }
}

export default config;