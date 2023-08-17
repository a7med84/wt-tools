(function () {
    "use strict";
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
    
    const input = document.getElementById("sessionsInput")
    const btn = document.getElementById("submitbtn");
    const loadingModal = document.getElementById("loadingModal");
    const loader = document.getElementById("loading");
    const richTextDiv = document.getElementById("richTextDiv");
    const emptyClip = document.getElementById("emptyClip");
    const fillClip = document.getElementById("fillClip");
    

    function loadingDisplay(show) {
        if (show) {
            loadingModal.style.display = "block"
            loader.classList.add("display");
        } else {
            loadingModal.style.display = "none"
            loader.classList.remove("display");
        }
    }

    const sendText = () => {
        const sessions = document.getElementById("sessionsInput").value;
        if (!sessions){
            alert('Enter sessions');
            return;
        }
        hideTextResult();
        loadingDisplay(true);
        const formData = new FormData();
        formData.append("sessions", sessions);
        fetch("/sessions/", {
            method: "POST",
            body: formData
        }).then(response => {
            console.log('response');
            return response.json();
            }
        ).then(data => {
            console.log("response recived");

            let is_success = false;
            let res = ''
            if (data.detail) {
                console.log("internal error");
                console.log(data.detail);
                res = data.detail
            } else if (data.result) {
                console.log("success");
                res = data.result
                is_success = true
            }
            loadingDisplay(false);
            showTextResult(res, is_success);
        }).catch(err => {
            console.log("error occured");
            console.error(err);
            loadingDisplay(false);
            showTextResult(err, false);
        })
    };

    const onTextChange = () => {
        hideTextResult();
    };

    input.addEventListener("change", onTextChange, false);
    input.addEventListener("keyup", onTextChange, false);

    btn.addEventListener("click", sendText, false);

    function showTextResult(res, is_success) {
        richTextDiv.innerHTML = res;
        if (is_success){
            richTextDiv.classList.remove("is-invalid");
            richTextDiv.classList.add("is-valid");
        }else{
            richTextDiv.classList.remove("is-valid");
            richTextDiv.classList.add("is-invalid");
        }
    }
    
    function hideTextResult() {
        richTextDiv.innerText = "";
        richTextDiv.classList.remove("is-valid");
        richTextDiv.classList.remove("is-invalid");   
    }

    document.getElementById('copyToClipboard-a').addEventListener('click', function() {
        const clipboardItem = new ClipboardItem({
            "text/plain": new Blob(
                [richTextDiv.innerText],
                { type: "text/plain" }
            ),
            "text/html": new Blob(
                [richTextDiv.outerHTML],
                { type: "text/html" }
            ),
        });

        navigator.clipboard.write([clipboardItem]);

        let range;
        if (document.selection) { // IE
            range = document.body.createTextRange();
            range.moveToElementText(richTextDiv);
            range.select();
        } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(richTextDiv);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }

        fillClip.classList.remove("d-none");
        emptyClip.classList.add("d-none")
      });

})();
