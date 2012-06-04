/*!
 * fileUpload jQuery plugin v1.1
 *
 * Copyright 2012, Gabriel Heming <gabriel_heming@hotmail.com>
 * GPL Version 2 licenses.
 *
 * Released under GPL Licenses.
 *
 * Date: Thu Apr 19 12:12:20 2012
 */
(function($){
    $.fn.fileUpload = function( customOptions ) {
        
        /** realiza a substituição entre as variáveis default e as passadas por parâmetro **/        
        this.live( 'click', function() {
            $.fn.fileUpload.defaultOptions = $.extend($.fn.fileUpload.defaultOptions, customOptions);
        
            var validate = false;
            var error_found = false;
            if( $.fn.fileUpload.defaultOptions.validate.length > 0 ) {
                for( i = 0; i < $.fn.fileUpload.defaultOptions.validate.length; i++  ) {
                
                    if( $( '#' + $.fn.fileUpload.defaultOptions.validate[0]  ).val().length == 0 ) {
                        error_found = true;
                        $( '#' + $.fn.fileUpload.defaultOptions.validate[0]  ).addClass( 'error' );
                    }
                }
                if( error_found == false ) {
                    validate = true;
                } 
                
            } else {
                validate = true;
            }
                        
            if( validate == true ) {
                $.fn.fileUpload.escope = $(this);
                $.fn.initialize();
            
                /** quando o iframe for carregado **/
                $.fn.fileUpload.iframe.load( function() {
                    /** retorna o valor do iframe **/
                    $.fn.fileUpload.retorno = $(this).contents().find('body').html();                            
                    setTimeout( $.fn.timeOut, 1000 );              
                });       
            }
            
        });             
    }
    
    $.fn.blockForm = function() {      
        
        /** bloqueia o formulário **/
        $.fn.fileUpload.formAfter.find( 'input, select' ).each( function() {
            $(this).attr( 'disabled', true );
        } );
         
    }
    
    $.fn.createIframe = function() {   
        
        /** cria o iframe invisível **/
        $.fn.fileUpload.iframe = $('<iframe>')
        .attr( 'border', '0' )
        .attr( 'height', '0' )
        .attr( 'id', $.fn.fileUpload.defaultOptions.iframeId )
        .attr( 'name', $.fn.fileUpload.defaultOptions.iframeId )
        .attr( 'style', 'border: none; height: 0px; width: 0px;' )
        .attr( 'width', '0' );                    
                                                    
        /** obtem o elemento body e insere o elemento no body **/
        $.fn.fileUpload.escope.parents( 'body' ).append( $.fn.fileUpload.iframe );   
        
        /** adiciona o iframe a lista DOM do window do IE **/
        window.frames[ $.fn.fileUpload.defaultOptions.iframeId ].name = $.fn.fileUpload.defaultOptions.iframeId;//ie sucks. by: micomix
        
        $.fn.prepareForm();
        
    }
    
    $.fn.execute = function() {
        $.fn.fileUpload.formAfter.submit();
        $.fn.blockForm();
    }
    
    $.fn.initialize = function() {
        $.fn.createIframe();
    }
    
    $.fn.prepareForm = function() {
        
        /** obtem o elemento form do input **/
        $.fn.fileUpload.formAfter = $.fn.fileUpload.escope.parents( 'form' );
        
        /** cria a entidade Form para manter os dados do formulário **/        
        $.fn.fileUpload.formBefore = $.fn.fileUpload.formAfter.clone();
        
        /** atualiza os dados do form para o upload**/
        $.fn.fileUpload.formAfter.attr( 'action', $.fn.fileUpload.defaultOptions.url );
        $.fn.fileUpload.formAfter.attr( 'encoding', 'multipart/form-data' );
        $.fn.fileUpload.formAfter.attr( 'enctype', 'multipart/form-data' );
        $.fn.fileUpload.formAfter.attr( 'method', 'post' );
        $.fn.fileUpload.formAfter.attr( 'target', $.fn.fileUpload.defaultOptions.iframeId );
        
        $.fn.execute();
    }
    
    $.fn.timeOut = function() {
        if( $.fn.fileUpload.retorno != null ) {
            
            /** remove o iframe **/
            $.fn.fileUpload.iframe.remove();                        
            
            
            switch( navigator.appName ) {
                case 'Microsoft Internet Explorer':
                    /** remove a imagem do input **/                
                    $.fn.fileUpload.formBefore.find('#file').replaceWith( $.fn.fileUpload.formBefore.find('#file').clone() );
                    break;
                default:
                    /** remove a imagem do input **/                
                    $.fn.fileUpload.formBefore.find('#file').val( '' );
            }
            
            /** habilita o form **/
            $.fn.fileUpload.formAfter.replaceWith( $.fn.fileUpload.formBefore );
            
            if( $.fn.fileUpload.defaultOptions.successMessage != false ) {
                alert( $.fn.fileUpload.defaultOptions.successMessage );                
            }
            
            /** retorna o valor do upload **/                
            $('#' + $.fn.fileUpload.defaultOptions.returnId ).html( $.fn.fileUpload.retorno );
        } else {
            setTimeout( $.fn.timeOut, 1000 );                
        }
    }
    
    /** opções padrões **/
    $.fn.fileUpload.defaultOptions = {
        form: 'form',
        iframeId: 'iframe_file_upload_temp',
        returnId: 'retornoUp',
        successMessage: false,
        url: 'upload.php',
        validate: []
    }
    
    /** objetos/elementos **/
    $.fn.fileUpload.escope = null;
    $.fn.fileUpload.formAfter = null;
    $.fn.fileUpload.formBefore = null;
    $.fn.fileUpload.iframe = null;
    $.fn.fileUpload.retorno = null;
    
})(jQuery);