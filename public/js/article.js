;(function($){
    ClassicEditor
    .create( document.querySelector( '#content' ), {
        language:"zh-cn",
        ckfinder:{
            uploadUrl:'/article/uploadImage'
        },
    })
    .then( editor => {
        console.log( 'Editor was initialized', editor );
    } )
    .catch( error => {
        console.error( error.stack );
    } );
})(jQuery)