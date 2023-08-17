(function () {
    "use strict";
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
    

    const loadingModal = document.getElementById("loadingModal");
    const loader = document.getElementById("loading");
    const inputMulti = document.getElementById("multiFiles");
    const btnMulti = document.getElementById("submitMultible");
    const feedbackMulti = document.getElementById("invalidFeedbackMultible");
    const filesUL = document.getElementById('filesUL');
    const successAlert = document.getElementById("successAlert");
    const errorAlert = document.getElementById("errorAlert");
    const fileLink = document.getElementById("fileLink");
    

    function loadingDisplay(show) {
        if (show) {
            loadingModal.style.display = "block"
            loader.classList.add("display");
        } else {
            loadingModal.style.display = "none"
            loader.classList.remove("display");
        }
    }

    const uploadMulti = (files) => {
        hideFileResult();
        loadingDisplay(true);

        const formData = new FormData();
        for (const child of filesUL.children)
            formData.append('files', files[child.dataset.file]);

        fetch("/merge-pdf/", {
            method: "POST",
            body: formData
        }).then(response => {
            console.log('response');
            return response.json();
        }
        ).then(data => {
            console.log("response recived");
            let result = ""
            if (data.detail) {
                console.log("internal error");
                console.log(data.detail);
                loadingDisplay(false);
                showFileError(data.detail);
            } else if (data.file_url) {
                console.log("success");
                console.log(data.file_url);
    
                loadingDisplay(false);
                showFileSuccess(data.file_url);
            }
        }).catch(err => {
            console.log("error occured");
            console.error(err);
            loadingDisplay(false);
            showFileError("Something went wrong, try again later");
        })
    };

    function showFileSuccess(file_href) {
        hideFileError()
        fileLink.setAttribute("href", file_href);
        successAlert.classList.remove("d-none");
    }
    
    function showFileError(msg) {
        hideFileSuccess();
        errorAlert.innerText = msg;
        errorAlert.classList.remove("d-none");
    }
    
    function hideFileSuccess() {
        successAlert.classList.add("d-none");
        fileLink.setAttribute("href", "#");
    }
    
    function hideFileError() {
        errorAlert.classList.add("d-none");
        errorAlert.innerText = "Something went wrong, try again later";
    }
    
    function hideFileResult() {
        hideFileSuccess();
        hideFileError();
    }
    
    
    function enableDragSort(listClass) {
        const sortableLists = document.getElementsByClassName(listClass);
        Array.prototype.map.call(sortableLists, (list) => { enableDragList(list) });
    }
    
    function enableDragList(list) {
        Array.prototype.map.call(list.children, (item) => { enableDragItem(item) });
    }
    
    function enableDragItem(item) {
        item.setAttribute('draggable', true)
        item.addEventListener("drag", (event) => handleDrag(event, item), false);
        item.addEventListener("dragend", (event) => handleDrop(item), false);
    }
    
    function handleDrag(event, selectedItem) {
        const list = selectedItem.parentNode,
            x = event.clientX,
            y = event.clientY;
    
        selectedItem.classList.add('drag-sort-active');
        let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
    
        if (list === swapItem.parentNode) {
            swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
            list.insertBefore(selectedItem, swapItem);
        }
    }
    
    function handleDrop(item) {
        item.classList.remove('drag-sort-active');
    }

    enableDragSort('drag-sort-enable');    

    const onFileChange = () => {
        // When the control has changed, there are new files
        if (inputMulti.files.length == 0) {
            btnMulti.disabled = true;
            inputMulti.classList.remove("is-invalid");
            return;
        }

        for (const file of inputMulti.files){
        if (!(file.type == "application/pdf")) {
            btnMulti.disabled = true;
            if (file) {
                inputMulti.classList.add("is-invalid");
                feedbackMulti.textContent = `Please only select PDF files`;
            }
            return;
        }

        if (file.size > 50*1024*1024) {
            btnMulti.disabled = true;
            inputMulti.classList.add("is-invalid");
            feedbackMulti.textContent = `Maximum allowed size: 50 MB`;
            return;
        }
        btnMulti.removeAttribute("disabled");
        inputMulti.classList.remove("is-invalid");
        }

        const div = document.getElementById('PDFS');
        if (inputMulti.files.length > 0){
            div.classList.remove('d-none');
        }else{
            //div.classList.add('d-none');
            filesUL.innerHTML = ""
        }
        let i = 0;
        for (const file of inputMulti.files){
            const fname = file.name.split(".")[0]
            const li = document.createElement("li");
            li.innerHTML = `<svg width="16" height="16" fill="currentColor" class="bi"><use xlink:href="#filepdf"/></svg> ${fname}`;
            li.setAttribute("data-file", i);
            li.setAttribute("class", "draggable");
            li.setAttribute("draggable", true);
            li.addEventListener("drag", (event) => handleDrag(event, li), false);
            li.addEventListener("dragend", (event) => handleDrop(li), false);
            filesUL.appendChild(li)
            i++;
        }
    };

    inputMulti.addEventListener("change", onFileChange, false);

    btnMulti.addEventListener("click", () => uploadMulti(inputMulti.files), false);

})();
