import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import Button from "../Button";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            Content: post?.Content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    

    const submit = async (data) => {
        try {
            if (post?.$id) {
                // Update existing post
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                
                // Check if post.$id is valid
                if (!post.$id) {
                    throw new Error("Post ID is missing");
                }
    
                if (file) {
                    appwriteService.deleteFile(post.featuredimage);
                }
    
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredimage: file ? file.$id : undefined,
                });
    
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
                if (!post) {
             return <p>No post data available</p>;
                 }
            } else {
                // Create new post
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
    
                if (file) {
                    const fileId = file.$id;
                    data.featuredimage = fileId;
                    console.log('File ID:', fileId);
                }
    
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });
    
                if (dbPost) {
                    navigate(`/post/${dbPost.fileId}`);
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
        }
    };
    

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-full md:w-2/3 px-2">
            <Input
                label="Title:"
                placeholder="Title"
                className="mb-4"
                {...register("title", { required: true })}
            />
            <Input
                label="Slug:"
                placeholder="Slug"
                className="mb-4"
                {...register("slug", { required: true })}
                onInput={(e) => {
                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                }}
            />
            <RTE label="Content:" name="Content" control={control} defaultValue={getValues("Content")} />
        </div>
        <div className="w-full md:w-1/3 px-2">
            <Input
                label="Featured Image:"
                type="file"
                className="mb-4"
                accept="image/png, image/jpeg"
                {...register("image", { required: !post })}
            />
            {post?.featuredimage && (
                <div className="w-full mb-4">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-lg w-full h-auto" // Ensure image fits within container
                    />
                </div>
            )}
            <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4"
                {...register("status", { required: true })}
            />
            <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                {post ? "Update" : "Submit"}
            </Button>
        </div>
    </form>
    
    );
}
