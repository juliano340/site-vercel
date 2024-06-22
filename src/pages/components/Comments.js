// components/Comments.js
import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

const Comments = ({ postId, postTitle }) => {
    const disqusShortname = "juliano340"; // Substitua pelo seu shortname do Disqus
    const disqusConfig = {
        url: `https://juliano340.com/blog/${postId}`,
        identifier: postId,
        title: postTitle,
    };

    return (
        <div className="mt-8">
            <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </div>
    );
};

export default Comments;
