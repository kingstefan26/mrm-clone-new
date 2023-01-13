export async function load({params, fetch}) {
    // const res = await fetch(`http://192.168.1.38:1337/api/posts?filters[title][$eq]=${params.slug}&populate=*`);
    const res = await fetch(`/altfeed/posts/${params.slug}`);

    if (res.ok && res.status === 200) {
        let data = await res.json();

        const post = data.entries[0];

        let metadata = {
            description: undefined,
            author_long: undefined,
            lang: undefined
        };

        // if (post.lang) {
        //   metadata.lang = post.lang;
        // }

        if (post.author) {
            metadata.author = post.author.shortname;
        }

        return {
            props: {post, metadata}
        };
    } else {
        const data = JSON.parse("{\"entries\":[{\"_id\":\"62426f66aad26860dd2b9182\",\"title\":\"test\",\"author\":\"test\",\"chapters\":[{\"_id\":\"62426f4377b2de1b8f62a652\",\"name\":\"test\",\"chapter_media\":[{\"meta\":{\"title\":\"\",\"asset\":\"62426f38bb7e4767a6400222\"},\"path\":\"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/index.png?v=1648708320976\"},{\"meta\":{\"title\":\"\",\"asset\":\"62426f38c0488a43543d8b72\"},\"path\":\"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/vertical.png?v=1648708320939\"},{\"meta\":{\"title\":\"\",\"asset\":\"62426f38cede4a53cb211d82\"},\"path\":\"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/horisontal.png?v=1648708321328\"}],\"_mby\":\"623f7bda63ec7431f5343042\",\"_by\":\"623f7bda63ec7431f5343042\",\"_modified\":1648521027,\"_created\":1648521027,\"_link\":\"chapters\"},{\"_id\":\"62426f50625b7b3d560d9a02\",\"name\":\"test2\",\"chapter_media\":[{\"meta\":{\"title\":\"\",\"asset\":\"62426f38bb7e4767a6400222\"},\"path\":\"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/index.png?v=1648708320976\"},{\"meta\":{\"title\":\"\",\"asset\":\"62426f38c0488a43543d8b72\"},\"path\":\"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/vertical.png?v=1648708320939\"},{\"meta\":{\"title\":\"\",\"asset\":\"62426f38cede4a53cb211d82\"},\"path\":\"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/horisontal.png?v=1648708321328\"}],\"_mby\":\"623f7bda63ec7431f5343042\",\"_by\":\"623f7bda63ec7431f5343042\",\"_modified\":1648521040,\"_created\":1648521040,\"_link\":\"chapters\"}],\"poster\":{\"path\":\"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/vertical.png?v=1648708320939\"},\"_mby\":\"623f7bda63ec7431f5343042\",\"_by\":\"623f7bda63ec7431f5343042\",\"_modified\":1648521062,\"_created\":1648521062}],\"total\":1}");
        const post = data.entries[0];

        let metadata = {
            description: undefined,
            author_long: undefined,
            lang: undefined
        };

        // if (post.lang) {
        //   metadata.lang = post.lang;
        // }

        if (post.author) {
            metadata.author = post.author.shortname;
        }
        return {
            post: {
                post,
                metadata
            }
        };
    }
}