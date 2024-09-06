import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        console.log('Available methods:', Object.keys(this.account))
    }


    async createAccount({ email, password, name }) {
        try {
            // console.log('Checking for existing user...');
            // const existingUser = await this.account.list({email});
            // if (existingUser.total > 0) {
            //     throw new Error('A user with this email already exists. Please log in instead.');
            // }

            console.log('Creating account...');
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            console.log('Account created:', userAccount);
            

            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error('Error creating account:', error.message);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            console.log('Logging in...');
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            console.error('Error logging in:', error.message);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error.message);
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error.message);
        }
    }
}

const authService = new AuthService();

export default authService;
