<script>
    import {enhance} from '$app/forms';
    import {goto} from "$app/navigation";
    import Popup from "$lib/components/popup/Popup.svelte";
    import '@material/web/button/filled-button'

    function uploadMrmZip(){
        const file = this.files[0];
        const formData = new FormData();
        formData.append('file', file);
        fetch('/api/import/mrm-scraper', {
            method: 'POST',
            body: formData
        }).then(res => {
            if(res.status === 200){
                alert('Imported!')
                res.json().then(data => {
                    console.log(data)
                    goto(`/admin/manage/posts/edit/${data.data.id}`)
                    data.data.id
                })
            } else {
                alert('Something went wrong')
            }
        })
    }

    const uploadFormData = (url, formData, onProgress) =>
        new Promise((resolve, reject) => {
            // need to use xml http request cuz upload progress
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', e => onProgress(e.loaded / e.total));
            xhr.addEventListener('load', () => resolve({status: xhr.status, body: xhr.responseText}));
            xhr.addEventListener('error', () => reject(new Error('File upload failed')));
            xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
            xhr.open('POST', url, true);
            xhr.send(formData);
            // wait for the request to finish
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve({status: xhr.status, body: xhr.responseText})
                }
            };
        });


    async function uploadDir(event) {
        const formData = new FormData();

        // add each file to formData with their respective data
        for (const file of event.target.files){
            formData.append(file.name, file)
        }


        try {
            const res = await uploadFormData('/api/import/folder', formData, (progress) => {
                uploadFolderProgress = progress
            })
            const {status, body} = res
            if(status !== 200) {
                throw new Error('Something went wrong')
            }
            const json = JSON.parse(body)
            console.log(json)
            // await goto(`/admin/manage/posts/create`)
            await goto(`/admin/manage/posts/edit/${json.data.id}`)
        } catch (e){
            alert('Something went wrong')
        }

    }
    let uploadFolderProgress = -1
    let folderExpanded = false
    let mrmExpanded = false
</script>

<div>
    <h1 class=" text-2xl text-white">
        Create a Post
    </h1>
    
    <div class="flex justify-center h-1/2">
        <div class="flex flex-col items-center gap-2">
            <form use:enhance method="POST" class="h-full flex flex-col gap-2">
                <h1 class="text-white text-xl font-bold" >Name Your Post</h1>
                <input required class="p-1" type="text" name="title" placeholder="Title">
                <input class="bg-stone-500 text-white p-0.5" type="submit" value="Create Skeleton">
            </form>
            <div>
                <Popup expanded="{mrmExpanded}">
                    <md-filled-button slot="alwaysVisible" class="font-bold"
                            on:click={() => {mrmExpanded = !mrmExpanded}}>
                        Import MRM-scraper-story
                    </md-filled-button>
                    <div slot="content">
                        <h1 class="text-white text-xl font-bold" >Import MRM-scraper-story</h1>
                        <input on:change={uploadMrmZip} class="bg-stone-500 text-white p-0.5" accept="application/zip" type="file">
                    </div>
                </Popup>
            </div>
            <div>
                <Popup expanded="{folderExpanded}">
                    <md-filled-button slot="alwaysVisible" class="font-bold"
                            on:click={() => {folderExpanded = !folderExpanded}}>
                        Import Folder
                    </md-filled-button>
    
                    <div slot="content">
                        <p>
                            This will import all files in the folder you select.
                            The first file will be used as the cover image.
                            The rest will be used as the post content.
                            The Filed should be numbered in the order you want them to appear. eg 1.jpg 2.jpg 3.jpg
                            You can also use Internalisation by adding a language code to the file name. eg 1.eng.jpg 1.de.jpg
                            <a class="underline" href="https://www.loc.gov/standards/iso639-2/php/code_list.php" target="_blank">(ISO lang codes)</a>
                        </p>
                        <label class="text-white text-xl font-bold">
                            Import folder
                        </label>
                        <input on:change={uploadDir}
                               multiple
                               webkitdirectory
                               class="bg-stone-500 text-white p-0.5"
                               type="file">
                        {#if uploadFolderProgress > -1}
                            <div class="progress-bar">
                                <div class="progress-bar__fill" style="width: {uploadFolderProgress * 100}%"/>
                            </div>
                        {/if}
                    </div>
                </Popup>
            </div>
        </div>
    </div>
</div>



<style>
    .progress-bar {
        width: 100%;
        height: 20px;
        background-color: #eee;
        border-radius: 5px;
        overflow: hidden;
    }

    .progress-bar__fill {
        height: 100%;
        background-color: #4caf50;
        transition: width 0.2s ease-in-out;
    }
</style>