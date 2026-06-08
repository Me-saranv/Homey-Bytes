// GitHub Sync Functions
// This saves data directly to your GitHub repository

class GitHubSync {
    constructor() {
        this.owner = localStorage.getItem('githubOwner') || '';
        this.repo = localStorage.getItem('githubRepo') || '';
        this.token = localStorage.getItem('githubToken') || '';
        this.branch = 'main';
    }

    setGitHubCredentials(owner, repo, token) {
        localStorage.setItem('githubOwner', owner);
        localStorage.setItem('githubRepo', repo);
        localStorage.setItem('githubToken', token);
        this.owner = owner;
        this.repo = repo;
        this.token = token;
    }

    async getFileContent(filePath) {
        if (!this.token) return null;
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`,
                {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                return {
                    content: JSON.parse(atob(data.content)),
                    sha: data.sha
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting file:', error);
            return null;
        }
    }

    async updateFile(filePath, content) {
        if (!this.token || !this.owner || !this.repo) {
            console.log('GitHub not configured. Using local storage only.');
            return false;
        }

        try {
            // Get current file SHA
            let sha = null;
            const existingFile = await this.getFileContent(filePath);
            if (existingFile) {
                sha = existingFile.sha;
            }

            const requestBody = {
                message: `Update ${filePath} - ${new Date().toLocaleString()}`,
                content: btoa(JSON.stringify(content, null, 2)),
                branch: this.branch
            };

            if (sha) {
                requestBody.sha = sha;
            }

            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (response.ok) {
                console.log(`✅ ${filePath} updated on GitHub!`);
                return true;
            } else {
                const error = await response.json();
                console.error('GitHub update error:', error);
                return false;
            }
        } catch (error) {
            console.error('Error updating file:', error);
            return false;
        }
    }

    async syncProducts(products) {
        return await this.updateFile('data/products.json', products);
    }

    async syncOrders(orders) {
        return await this.updateFile('data/orders.json', orders);
    }

    async syncAll() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        await this.syncProducts(products);
        await this.syncOrders(orders);
    }
}

const gitSync = new GitHubSync();
