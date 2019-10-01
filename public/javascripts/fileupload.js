FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
    );

    FilePond.setOptions({
        stylePanelAspectRatio: 100 / 80,
        imageResizeTargetWidth: 80,
        imageResizeTargetHeight: 100

    })   

FilePond.parse(document.body);