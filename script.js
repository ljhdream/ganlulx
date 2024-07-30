document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const fileDisplay = document.getElementById('fileDisplay');

    // 初始化轮播功能
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        const slides = document.getElementsByClassName("mySlides");
        const dots = document.getElementsByClassName("dot");

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";

        setTimeout(showSlides, 2000); // 切换时间间隔（2秒）
    }

    // 上传文件表单提交事件
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('上传失败');
                }
                return response.json();
            })
            .then(data => {
                alert('文件上传成功！');
                form.reset();
                // 重新加载文件列表
                loadFiles();
            })
            .catch(error => {
                alert('上传失败，请重试！');
                console.error('上传失败：', error);
            });
    });

    // 加载文件列表
    function loadFiles() {
        fetch('/files') // 从服务器获取文件列表的接口路径
            .then(response => response.json())
            .then(files => {
                // 清空原有文件显示区域内容
                fileDisplay.innerHTML = '';

                // 初始化展示的三个不同文件类型的文件
                const initialFiles = files.slice(0, 3);
                initialFiles.forEach(file => {
                    const fileItem = createFileItem(file);
                    fileDisplay.appendChild(fileItem);
                });
            })
            .catch(error => {
                console.error('加载文件列表失败：', error);
            });
    }

    // 创建文件展示项
    function createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        let fileTypeIcon;
        if (file.type.includes('image')) {
            fileTypeIcon = '🖼️';
        } else if (file.type.includes('video')) {
            fileTypeIcon = '🎥';
        } else if (file.type.includes('audio')) {
            fileTypeIcon = '🎵';
        } else {
            fileTypeIcon = '📄';
        }

        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-type">${fileTypeIcon}</span>
                <span class="file-title">${file.title}</span>
                <span class="file-school">${file.school}</span>
            </div>
            <div class="file-actions">
                <a class="file-download" href="${file.url}" download>下载</a>
            </div>
        `;

        return fileItem;
    }

    // 页面加载时加载文件列表
    loadFiles();
});
