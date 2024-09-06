import conf from "../conf/conf"
import { Client, ID, Databases,Storage,Query } from "appwrite";

export class Service {
    client= new Client()
    databases;
    bucket;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }
    // Post related Services
    
    async createPost(post){        
        let { title, slug, Content,featuredimage,status, userId } = post
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    Content,
                    featuredimage,
                    status,
                    userId,
                }
            )
            
        } catch (error) {
            throw error
        }
    }
    async updatePost(slug,{ title,  content,featuredimage,status,}){
        try {
            return await this.databases.updateDocument(
                 conf.appwriteDatabaseId,
                 conf.appwriteCollectionId,
                 slug,
                 {
                    title,
                    content,
                    featuredimage,
                    status,
                 }
            )
        } catch (error) {
            throw error
        }
    }
    async dletePost(slug){
      try {
        return await this.databases.deleteDocument(
             conf.appwriteDatabaseId,
             conf.appwriteCollectionId,
             slug,
        )
        return true;
      } catch (error) {
        throw error
        return false;
      }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            throw error
        }
    }
    async getPosts(queries=[Query.equal("status","active")]){
    try {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            queries,
        )
    } catch (error) {
        throw error
    }
    }
    // File Upload Services
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,

            )
        } catch (error) {
            throw error
        }
    }
    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            throw error
            return false;
        }
    }
    getFilePreview(fileId){
      return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId,
      )
    }
}


const service = new Service();
export default service;
