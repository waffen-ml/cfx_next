"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFeed } from "@/lib/post/post.actions";
import Post from "./Post/Post";
import PostWrapper from "./Post/PostWrapper";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Feed({ userId }: { userId: string }) {
    const { data, status, fetchNextPage } = useInfiniteQuery({
        queryKey: ["feed", userId],
        queryFn: ({ pageParam }: { pageParam: number }) =>
            getFeed(userId, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });
    const { ref, inView } = useInView();

    const loadedPosts =
        data === undefined
            ? []
            : data.pages.reduce((acc, page) => [...acc, ...page.data], []);

    useEffect(() => {
        if (inView) fetchNextPage();
    }, [fetchNextPage, inView]);

    return (
        <div>
            <ul className="w-full">
                {loadedPosts.map((post) => (
                    <li key={post._id} className="mb-1">
                        <PostWrapper>
                            <Post post={post} />
                        </PostWrapper>
                    </li>
                ))}
            </ul>
            <div ref={ref} className="h-[30px]"></div>
        </div>
    );
}
