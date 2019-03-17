$(document).ready(function() {

	$.validate({
	    modules : 'location, date, security, file',
	    onModulesLoaded : function() {
	      $('#country').suggestCountry();
	    }
  	});

    setTimeout(function() {
      $("#successMessage").hide('blind', {}, 500)
    }, 7000);


  	$('.cancel').on('click', function() {
  		window.location.href=$(this).attr('rel');
  	})

  	$('.selAll').on('click', function () {
  		$obj = $(this);
  		if($obj.is(':checked')){
  			$obj.parents('thead').siblings('tbody').find('input[name="selData"]').prop('checked', true);;
  		} else {
  			$obj.parents('thead').siblings('tbody').find('input[name="selData"]').removeAttr('checked');
  		}
  	});

  	$('body').on('click', '.delSelected', function() {
  		$obj = $(this);
  		$tabClass = $obj.attr('rel');
  		$base_url = $obj.attr('data-base-url');
  		$arr = [];
  		$('#cnfrm_delete').find('.modal-body').find('input[name="ids"]').remove();
  		$('table.' + $tabClass).find('tbody').find('input[name="selData"]').each(function() {
  			$inpObj = $(this);
  			if($inpObj.is(':checked')){
  				$arr.push($inpObj.val());
  			}
  		});
  		if($arr.length > 0) {
  			//console.log($arr);
  			$('#cnfrm_delete').find('.yes-btn').attr('href', $base_url+$arr.join('-'));
  			$('#cnfrm_delete').modal('show');
  		}
  	});

  /* Script for profile page start here */

  $("#fileUpload").on('change', function () {
    if (typeof (FileReader) != "undefined") {
      var image_holder = $("#image-holder");
      image_holder.empty();
      var reader = new FileReader();
      reader.onload = function (e) {
        $("<img />", {
          "src": e.target.result,
          "class": "thumb-image setpropileam"
        }).appendTo(image_holder);
      }
      image_holder.show();
      reader.readAsDataURL($(this)[0].files[0]);
    } else {
      alert("This browser does not support FileReader.");
    }
  });


  $('#profileSubmit').on('click', function() {
    $res = 1;
    $('div.form-group').each(function() {
      if($(this).hasClass('has-error')){
        $res = 0;
      }
    });
    if($res == 1) {
      $('form').submit();
    }
  })

  $('#profileEmail').bind('change keyup', function() {
    $obj = $(this);
    $obj.parents('div.form-group')
        .removeClass('has-error')
        .find('span.text-red').remove();
    var email = $obj.val();
    var uId = $('[name="id"]').val();
    $.ajax({
      url:  $('body').attr('data-base-url') + 'user/checEmailExist',
      method:'post',
      data:{
        email :email,
        uId : uId
      }
    }).done(function(data) {
      if(data == 0) {
        $obj
        .after('<span class="text-red">This Email Already Exist...</span>')
        .parents('div.form-group')
        .addClass('has-error');
      }
      console.log(data);
    })
  })

  /* Script for profile page End here */

  /* Script for user page start here */
  $('.InviteUser').on('click', function() {
    $('#nameModal_user').find('.box-title').text('Invite People');
    $('#nameModal_user').find('.modal-body').html('<div class="row">'+
        '<div class="col-md-12 m-t-20 form-horizontal">'+
          '<label for="sEmail" class="">Enter Email Address</label>'+
          '<textarea name="emails" id="" rows="5" class="form-control"></textarea>'+
          '<span class="help-text">Enter Valid Emails Saperated by comma (,)</span>'+
          '<p>'+
            '<button class="btn btn-primary pull-right send-btn">Send</button>'+
          '</p>'+
        '</div>'+
      '</div>');
    $('#nameModal_user').modal('show');
  });

  $('.modal-body').on('click', '.send-btn', function() {
    $obj = $(this);
    $obj.html('<i class="fa fa-cog fa-spin"></i> Send');
    $obj.parents('div.row').find('.msg-div').remove();
    $emails = $obj.parents('.modal-body').find('textarea').val();
    if($emails != ''){
      $.ajax({
        url: $('body').attr('data-base-url') + 'user/InvitePeople',
        method:'post',
        data: {
          emails: $emails
        },
        dataType: 'json'
      }).done(function(data){
        console.log(data);
        if(data) {
          var part = '';
          if(data.noTemplate != 0){
            part = '<p><strong>Info:</strong> '+data.noTemplate+'</p>';
          }
          $obj.parents('div.row').prepend('<div class="col-md-12 m-t-20 msg-div"><div class="alert alert-info" role="alert">'+
                                  '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>'+
                                  '<div class="msg-p">'+
                                  '<p><strong>Success:</strong> '+data.seccessCount+' Invitation Sent successfully</p>'+
                                  '<p><strong>Info:</strong> '+data.existCount+' Emails Alredy present in database</p>'+
                                  '<p><strong>Info:</strong> '+data.invalidEmailCount+' Invalid Emails Found</p>'+part+
                                  '</div>'+
                                  '</div>'+
                                '</div>');
          $obj.html('Send');
        }
      });
    } else {
      alert('Enter Email First');
    }
  });

  $(".content-wrapper").on("click",".modalButtonUser", function(e) {
    $.ajax({
      url : $('body').attr('data-base-url') + 'user/get_modal',
      method: 'post',
      data : {
        id: $(this).attr('data-src')
      }
    }).done(function(data) {
      $('#nameModal_user').find('.modal-body').html(data);
      $('#nameModal_user').modal('show');
    })
  });

/*  $("#nameModal_user").on("hidden.bs.modal", function(){
    $(this).find("iframe").html("");
    $(this).find("iframe").attr("src", "");
    });*/
  /* Script for user page end here */

  /* Script for Templates Starts here */
    $('.box-body').on('click', '.view_template', function() {
      $obj = $(this);
      $tmp_id = $obj.attr('data-src');
      $.ajax({
        url: $('body').attr('data-base-url') + "templates/preview",
        method:'post',
        data:{
          template_id: $tmp_id
        }
      }).done(function(data) {
        $('#previewModal').find('div.modal-body').html(data);
        $('#previewModal').modal('show');
        $('#previewModal').find('a').attr('href', 'javascript:;');
      });
    });

  $(".content-wrapper").on("click",".templateModalButton", function(e) {
    $.ajax({
      url : $('body').attr('data-base-url') + "templates/modal_form",
      method: "post",
      data : {
      id: $(this).attr("data-src")
      }
      }).done(function(data) {
      $("#nameModal_Templates").find(".modal-body").html(data);
      $("#nameModal_Templates").modal("show");
    })
  });
  /* Script for Templates End here */
});

function setId(id, module) {
  var url =  $('body').attr('data-base-url');
  $("#cnfrm_delete").find("a.yes-btn").attr("href",url+"/"+ module +"/delete/"+id);
}

function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + "px";
}
// Home page dashboard calendar
$(function () {

// top bar active
$('#navDashboard').addClass('active');

		//Date for the calendar events (dummy data)
		var date = new Date();
		var d = date.getDate(),
		m = date.getMonth(),
		y = date.getFullYear();

		$('#calendar').fullCalendar({
			header: {
				left: '',
				center: 'title'
			},
			buttonText: {
				today: 'today',
				month: 'month'
			}
		});
	});


	// Brand Js Code
	var manageBrandTable;

	$(document).ready(function() {
		// top bar active
		$('#navBrand').addClass('active');

		// manage brand table
		manageBrandTable = $("#example1").DataTable();

		// submit brand form function
		$("#submitBrandForm").unbind('submit').bind('submit', function() {
			// remove the error text
			$(".text-danger").remove();
			// remove the form error
			$('.form-group').removeClass('has-error').removeClass('has-success');

			var brandName = $("#brandName").val();
			var brandStatus = $("#brandStatus").val();

			if(brandName == "") {
				$("#brandName").after('<p class="text-danger">Brand Name field is required</p>');
				$('#brandName').closest('.form-group').addClass('has-error');
			} else {
				// remov error text field
				$("#brandName").find('.text-danger').remove();
				// success out for form
				$("#brandName").closest('.form-group').addClass('has-success');
			}

			if(brandStatus == "") {
				$("#brandStatus").after('<p class="text-danger">Brand Name field is required</p>');

				$('#brandStatus').closest('.form-group').addClass('has-error');
			} else {
				// remov error text field
				$("#brandStatus").find('.text-danger').remove();
				// success out for form
				$("#brandStatus").closest('.form-group').addClass('has-success');
			}

			if(brandName && brandStatus) {
				var form = $(this);
				// button loading
				$("#createBrandBtn").button('loading');

				$.ajax({
					url : form.attr('action'),
					type: form.attr('method'),
					data: form.serialize(),
					dataType: 'json',
					success:function(response) {
						// button loading
						$("#createBrandBtn").button('reset');

						if(response.success == true) {
							// reload the manage member table
							manageBrandTable.ajax.reload(null, false);

	  	  			// reset the form text
							$("#submitBrandForm")[0].reset();
							// remove the error text
							$(".text-danger").remove();
							// remove the form error
							$('.form-group').removeClass('has-error').removeClass('has-success');

	  	  			$('#add-brand-messages').html('<div class="alert alert-success">'+
	            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
	            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
	          '</div>');

	  	  			$(".alert-success").delay(500).show(10, function() {
								$(this).delay(3000).hide(10, function() {
									$(this).remove();
								});
							}); // /.alert
						}  // if

					} // /success
				}); // /ajax
			} // if

			return false;
		}); // /submit brand form function

	});

	function editBrands(brandId = null) {
		if(brandId) {
			// remove hidden brand id text
			$('#brandId').remove();

			// remove the error
			$('.text-danger').remove();
			// remove the form-error
			$('.form-group').removeClass('has-error').removeClass('has-success');

			// modal loading
			$('.modal-loading').removeClass('div-hide');
			// modal result
			$('.edit-brand-result').addClass('div-hide');
			// modal footer
			$('.editBrandFooter').addClass('div-hide');

			$.ajax({
				url: 'brand/fetchSelectedBrand',
				type: 'post',
				data: {brandId : brandId},
				dataType: 'json',
				success:function(result) {


					// console.log(response);
					$.each(result,function(index, response){
					// modal loading
					$('.modal-loading').addClass('div-hide');
					// modal result
					$('.edit-brand-result').removeClass('div-hide');
					// modal footer
					$('.editBrandFooter').removeClass('div-hide');

					// setting the brand name value
					$('#editBrandName').val(response.brand_name);
					// setting the brand status value
					$('#editBrandStatus').val(response.brand_active);
					// brand id
					$(".editBrandFooter").after('<input type="hidden" name="brandId" id="brandId" value="'+response.brand_id+'" />');

					// update brand form
					$('#editBrandForm').unbind('submit').bind('submit', function() {

						// remove the error text
						$(".text-danger").remove();
						// remove the form error
						$('.form-group').removeClass('has-error').removeClass('has-success');

						var brandName = $('#editBrandName').val();
						var brandStatus = $('#editBrandStatus').val();

						if(brandName == "") {
							$("#editBrandName").after('<p class="text-danger">Brand Name field is required</p>');
							$('#editBrandName').closest('.form-group').addClass('has-error');
						} else {
							// remov error text field
							$("#editBrandName").find('.text-danger').remove();
							// success out for form
							$("#editBrandName").closest('.form-group').addClass('has-success');
						}

						if(brandStatus == "") {
							$("#editBrandStatus").after('<p class="text-danger">Brand Name field is required</p>');

							$('#editBrandStatus').closest('.form-group').addClass('has-error');
						} else {
							// remove error text field
							$("#editBrandStatus").find('.text-danger').remove();
							// success out for form
							$("#editBrandStatus").closest('.form-group').addClass('has-success');
						}

						if(brandName && brandStatus) {
							var form = $(this);

							// submit btn
							$('#editBrandBtn').button('loading');

							$.ajax({
								url: form.attr('action'),
								type: form.attr('method'),
								data: form.serialize(),
								dataType: 'json',
								success:function(response) {

									if(response.success == true) {
										console.log(response);
										// submit btn
										$('#editBrandBtn').button('reset');

										// reload the manage member table
										manageBrandTable.ajax.reload(null, false);
										// remove the error text
										$(".text-danger").remove();
										// remove the form error
										$('.form-group').removeClass('has-error').removeClass('has-success');

				  	  			$('#edit-brand-messages').html('<div class="alert alert-success">'+
				            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
				            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
				          '</div>');

				  	  			$(".alert-success").delay(500).show(10, function() {
											$(this).delay(3000).hide(10, function() {
												$(this).remove();
											});
										}); // /.alert
									} // /if

								}// /success
							});	 // /ajax
						} // /if

						return false;
					}); // /update brand form

					});

				} // /success
			}); // ajax function

		} else {
			alert('error!! Refresh the page again');
		}
	} // /edit brands function

	function removeBrands(brandId = null) {
		if(brandId) {
			$('#removeBrandId').remove();
			$.ajax({
				url: 'brand/fetchSelectedBrand',
				type: 'post',
				data: {brandId : brandId},
				dataType: 'json',
				success:function(response) {
					$('.removeBrandFooter').after('<input type="hidden" name="removeBrandId" id="removeBrandId" value="'+response.brand_id+'" /> ');

					// click on remove button to remove the brand
					$("#removeBrandBtn").unbind('click').bind('click', function() {
						// button loading
						$("#removeBrandBtn").button('loading');

						$.ajax({
							url: 'brand/delete',
							type: 'post',
							data: {brandId : brandId},
							dataType: 'json',
							success:function(response) {

								// button loading
								$("#removeBrandBtn").button('reset');
								if(response.success == true) {

									// hide the remove modal
									$('#removeMemberModal').modal('hide');


									// reload the brand table
									manageBrandTable.ajax.reload(null, false);

									$('.remove-messages').html('<div class="alert alert-success">'+
				            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
				            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
				          '</div>');

				  	  			$(".alert-success").delay(500).show(10, function() {
											$(this).delay(3000).hide(10, function() {
												$(this).remove();
											});
										}); // /.alert
								} else {

								} // /else
							} // /response messages
						}); // /ajax function to remove the brand

					}); // /click on remove button to remove the brand

				} // /success
			}); // /ajax

			$('.removeBrandFooter').after();
		} else {
			alert('error!! Refresh the page again');
		}
	} // /remove brands function



// Category Modal code

var manageCategoriesTable;

$(document).ready(function() {
 // active top navbar categories
 $('#navCategories').addClass('active');

 manageCategoriesTable = $('#manageCategoriesTable').DataTable(); // manage categories Data Table

 // on click on submit categories form modal
 $('#addCategoriesModalBtn').unbind('click').bind('click', function() {
	 // reset the form text
	 $("#submitCategoriesForm")[0].reset();
	 // remove the error text
	 $(".text-danger").remove();
	 // remove the form error
	 $('.form-group').removeClass('has-error').removeClass('has-success');

	 // submit categories form function
	 $("#submitCategoriesForm").unbind('submit').bind('submit', function() {

		 var categoriesName = $("#categoriesName").val();
		 var categoriesStatus = $("#categoriesStatus").val();

		 if(categoriesName == "") {
			 $("#categoriesName").after('<p class="text-danger">Brand Name field is required</p>');
			 $('#categoriesName').closest('.form-group').addClass('has-error');
		 } else {
			 // remov error text field
			 $("#categoriesName").find('.text-danger').remove();
			 // success out for form
			 $("#categoriesName").closest('.form-group').addClass('has-success');
		 }

		 if(categoriesStatus == "") {
			 $("#categoriesStatus").after('<p class="text-danger">Brand Name field is required</p>');
			 $('#categoriesStatus').closest('.form-group').addClass('has-error');
		 } else {
			 // remov error text field
			 $("#categoriesStatus").find('.text-danger').remove();
			 // success out for form
			 $("#categoriesStatus").closest('.form-group').addClass('has-success');
		 }

		 if(categoriesName && categoriesStatus) {
			 var form = $(this);
			 // button loading
			 $("#createCategoriesBtn").button('loading');

			 $.ajax({
				 url : form.attr('action'),
				 type: form.attr('method'),
				 data: form.serialize(),
				 dataType: 'json',
				 success:function(response) {
					 // button loading
					 $("#createCategoriesBtn").button('reset');

					 if(response.success == true) {
						 // reload the manage member table
						 manageCategoriesTable.ajax.reload();

						 // reset the form text
						 $("#submitCategoriesForm")[0].reset();
						 // remove the error text
						 $(".text-danger").remove();
						 // remove the form error
						 $('.form-group').removeClass('has-error').removeClass('has-success');

						 $('#add-categories-messages').html('<div class="alert alert-success">'+
						 '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
						 '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
						 '</div>');

						 $(".alert-success").delay(500).show(10, function() {
							 $(this).delay(3000).hide(10, function() {
								 $(this).remove();
							 });
						 }); // /.alert
					 }  // if

				 } // /success
			 }); // /ajax
		 } // if

		 return false;
	 }); // submit categories form function
 }); // /on click on submit categories form modal

}); // /document

// edit categories function
function editCategories(categoriesId = null) {
 if(categoriesId) {
	 // remove the added categories id
	 $('#editCategoriesId').remove();
	 // reset the form text
	 $("#editCategoriesForm")[0].reset();
	 // reset the form text-error
	 $(".text-danger").remove();
	 // reset the form group errro
	 $('.form-group').removeClass('has-error').removeClass('has-success');

	 // edit categories messages
	 $("#edit-categories-messages").html("");
	 // modal spinner
	 $('.modal-loading').removeClass('div-hide');
	 // modal result
	 $('.edit-categories-result').addClass('div-hide');
	 //modal footer
	 $(".editCategoriesFooter").addClass('div-hide');

	 $.ajax({
		 url: 'category/fetchSelectedCategory',
		 type: 'post',
		 data: {categoriesId: categoriesId},
		 dataType: 'json',
		 success:function(result) {

			 // console.log(response);
			 $.each(result,function(index, response){

			 // modal spinner
			 $('.modal-loading').addClass('div-hide');
			 // modal result
			 $('.edit-categories-result').removeClass('div-hide');
			 //modal footer
			 $(".editCategoriesFooter").removeClass('div-hide');

			 // set the categories name
			 $("#editCategoriesName").val(response.categories_name);
			 // set the categories status
			 $("#editCategoriesStatus").val(response.categories_active);
			 // add the categories id
			 $(".editCategoriesFooter").after('<input type="hidden" name="editCategoriesId" id="editCategoriesId" value="'+response.categories_id+'" />');


			 // submit of edit categories form
			 $("#editCategoriesForm").unbind('submit').bind('submit', function() {
				 var categoriesName = $("#editCategoriesName").val();
				 var categoriesStatus = $("#editCategoriesStatus").val();

				 if(categoriesName == "") {
					 $("#editCategoriesName").after('<p class="text-danger">Brand Name field is required</p>');
					 $('#editCategoriesName').closest('.form-group').addClass('has-error');
				 } else {
					 // remov error text field
					 $("#editCategoriesName").find('.text-danger').remove();
					 // success out for form
					 $("#editCategoriesName").closest('.form-group').addClass('has-success');
				 }

				 if(categoriesStatus == "") {
					 $("#editCategoriesStatus").after('<p class="text-danger">Brand Name field is required</p>');
					 $('#editCategoriesStatus').closest('.form-group').addClass('has-error');
				 } else {
					 // remov error text field
					 $("#editCategoriesStatus").find('.text-danger').remove();
					 // success out for form
					 $("#editCategoriesStatus").closest('.form-group').addClass('has-success');
				 }

				 if(categoriesName && categoriesStatus) {
					 var form = $(this);
					 // button loading
					 $("#editCategoriesBtn").button('loading');

					 $.ajax({
						 url : form.attr('action'),
						 type: form.attr('method'),
						 data: form.serialize(),
						 dataType: 'json',
						 success:function(response) {
							 // button loading
							 $("#editCategoriesBtn").button('reset');

							 if(response.success == true) {
								 // reload the manage member table
								 manageCategoriesTable.ajax.reload();

								 // remove the error text
								 $(".text-danger").remove();
								 // remove the form error
								 $('.form-group').removeClass('has-error').removeClass('has-success');

								 $('#edit-categories-messages').html('<div class="alert alert-success">'+
								 '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
								 '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
								 '</div>');

								 $(".alert-success").delay(500).show(10, function() {
									 $(this).delay(3000).hide(10, function() {
										 $(this).remove();
									 });
								 }); // /.alert
							 }  // if

						 } // /success
					 }); // /ajax
				 } // if


				 return false;
			 }); // /submit of edit categories form
		 });

		 } // /success
	 }); // /fetch the selected categories data

 } else {
	 alert('Oops!! Refresh the page');
 }
} // /edit categories function

// remove categories function
function removeCategories(categoriesId = null) {

 $.ajax({
	 url: 'category/fetchSelectedCategory',
	 type: 'post',
	 data: {categoriesId: categoriesId},
	 dataType: 'json',
	 success:function(response) {

		 // remove categories btn clicked to remove the categories function
		 $("#removeCategoriesBtn").unbind('click').bind('click', function() {
			 // remove categories btn
			 $("#removeCategoriesBtn").button('loading');

			 $.ajax({
				 url: 'category/delete',
				 type: 'post',
				 data: {categroyId: categoriesId},
				 dataType: 'json',
				 success:function(response) {
					 if(response.success == true) {
							 // remove categories btn
						 $("#removeCategoriesBtn").button('reset');
						 // close the modal
						 $("#removeCategoriesModal").modal('hide');
						 // update the manage categories table
						 manageCategoriesTable.ajax.reload();
						 // udpate the messages
						 $('.remove-messages').html('<div class="alert alert-success">'+
						 '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
						 '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
						 '</div>');

						 $(".alert-success").delay(500).show(10, function() {
							 $(this).delay(3000).hide(10, function() {
								 $(this).remove();
							 });
						 }); // /.alert
						 } else {
							 // close the modal
						 $("#removeCategoriesModal").modal('hide');

							 // udpate the messages
						 $('.remove-messages').html('<div class="alert alert-success">'+
						 '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
						 '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
						 '</div>');

						 $(".alert-success").delay(500).show(10, function() {
							 $(this).delay(3000).hide(10, function() {
								 $(this).remove();
							 });
						 }); // /.alert
						 } // /else


				 } // /success function
			 }); // /ajax function request server to remove the categories data
		 }); // /remove categories btn clicked to remove the categories function

	 } // /response
 }); // /ajax function to fetch the categories data
} // remove categories function



// Product code
var manageProductTable;

$(document).ready(function() {
	// top nav bar
	$('#navProduct').addClass('active');
	// manage product data table
	manageProductTable = $('#manageProductTable').DataTable();

	// add product modal btn clicked
	$("#addProductModalBtn").unbind('click').bind('click', function() {
		// // product form reset
		$("#submitProductForm")[0].reset();

		// remove text-error
		$(".text-danger").remove();
		// remove from-group error
		$(".form-group").removeClass('has-error').removeClass('has-success');

		$("#productImage").fileinput({
	      overwriteInitial: true,
		    maxFileSize: 2500,
		    showClose: false,
		    showCaption: false,
		    browseLabel: '',
		    removeLabel: '',
		    browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
		    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
		    removeTitle: 'Cancel or reset changes',
		    elErrorContainer: '#kv-avatar-errors-1',
		    msgErrorClass: 'alert alert-block alert-danger',
		    defaultPreviewContent: '<img src="'+url+'assets/images/photo_default.png" alt="Profile Image" style="width:100%;">',
		    layoutTemplates: {main2: '{preview} {remove} {browse}'},
	  		allowedFileExtensions: ["jpg", "png", "gif", "JPG", "PNG", "GIF"]
			});

		// submit product form
		$("#submitProductForm").unbind('submit').bind('submit', function() {

			// form validation
			var productImage = $("#productImage").val();
			var productName = $("#productName").val();
			var quantity = $("#quantity").val();
			var rate = $("#rate").val();
			var brandName = $("#brandName").val();
			var categoryName = $("#categoryName").val();
			var productStatus = $("#productStatus").val();

			if(productImage == "") {
				$("#productImage").closest('.center-block').after('<p class="text-danger">Product Image field is required</p>');
				$('#productImage').closest('.form-group').addClass('has-error');
			}	else {
				// remov error text field
				$("#productImage").find('.text-danger').remove();
				// success out for form
				$("#productImage").closest('.form-group').addClass('has-success');
			}	// /else

			if(productName == "") {
				$("#productName").after('<p class="text-danger">Product Name field is required</p>');
				$('#productName').closest('.form-group').addClass('has-error');
			}	else {
				// remov error text field
				$("#productName").find('.text-danger').remove();
				// success out for form
				$("#productName").closest('.form-group').addClass('has-success');
			}	// /else

			if(quantity == "") {
				$("#quantity").after('<p class="text-danger">Quantity field is required</p>');
				$('#quantity').closest('.form-group').addClass('has-error');
			}	else {
				// remov error text field
				$("#quantity").find('.text-danger').remove();
				// success out for form
				$("#quantity").closest('.form-group').addClass('has-success');
			}	// /else

			if(rate == "") {
				$("#rate").after('<p class="text-danger">Rate field is required</p>');
				$('#rate').closest('.form-group').addClass('has-error');
			}	else {
				// remov error text field
				$("#rate").find('.text-danger').remove();
				// success out for form
				$("#rate").closest('.form-group').addClass('has-success');
			}	// /else

			if(brandName == "") {
				$("#brandName").after('<p class="text-danger">Brand Name field is required</p>');
				$('#brandName').closest('.form-group').addClass('has-error');
			}	else {
				// remov error text field
				$("#brandName").find('.text-danger').remove();
				// success out for form
				$("#brandName").closest('.form-group').addClass('has-success');
			}	// /else

			if(categoryName == "") {
				$("#categoryName").after('<p class="text-danger">Category Name field is required</p>');
				$('#categoryName').closest('.form-group').addClass('has-error');
			}	else {
				// remov error text field
				$("#categoryName").find('.text-danger').remove();
				// success out for form
				$("#categoryName").closest('.form-group').addClass('has-success');
			}	// /else

			if(productStatus == "") {
				$("#productStatus").after('<p class="text-danger">Product Status field is required</p>');
				$('#productStatus').closest('.form-group').addClass('has-error');
			}	else {
				// remov error text field
				$("#productStatus").find('.text-danger').remove();
				// success out for form
				$("#productStatus").closest('.form-group').addClass('has-success');
			}	// /else

			if(productImage && productName && quantity && rate && brandName && categoryName && productStatus) {
				// submit loading button
				$("#createProductBtn").button('loading');

				var form = $(this);
				var formData = new FormData(this);

				$.ajax({
					url : form.attr('action'),
					type: form.attr('method'),
					data: formData,
					dataType: 'json',
					cache: false,
					contentType: false,
					processData: false,
					success:function(response) {

						if(response.success == true) {
							// submit loading button
							$("#createProductBtn").button('reset');

							$("#submitProductForm")[0].reset();

							$("html, body, div.modal, div.modal-content, div.modal-body").animate({scrollTop: '0'}, 100);

							// shows a successful message after operation
							$('#add-product-messages').html('<div class="alert alert-success">'+
		            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
		            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
		          '</div>');

							// remove the mesages
		          $(".alert-success").delay(500).show(10, function() {
								$(this).delay(3000).hide(10, function() {
									$(this).remove();
								});
							}); // /.alert

		          // reload the manage student table
							manageProductTable.ajax.reload();

							// remove text-error
							$(".text-danger").remove();
							// remove from-group error
							$(".form-group").removeClass('has-error').removeClass('has-success');

						} // /if response.success

					} // /success function
				}); // /ajax function
			}	 // /if validation is ok

			return false;
		}); // /submit product form

	}); // /add product modal btn clicked


	// remove product

}); // document.ready fucntion

function editProduct(productId = null) {

	if(productId) {
		$("#productId").remove();
		// remove text-error
		$(".text-danger").remove();
		// remove from-group error
		$(".form-group").removeClass('has-error').removeClass('has-success');
		// modal spinner
		$('.div-loading').removeClass('div-hide');
		// modal div
		$('.div-result').addClass('div-hide');

		$.ajax({
			url: 'product/fetchSelectedProduct',
			type: 'post',
			data: {productId: productId},
			dataType: 'json',
			success:function(result) {
				$.each(result,function(index, response){
				// console.log(response);
			// alert(response.product_image);
				// modal spinner
				$('.div-loading').addClass('div-hide');
				// modal div
				$('.div-result').removeClass('div-hide');

				$("#getProductImage").attr('src', url+'/'+response.product_image);

				$("#editProductImage").fileinput({
				});

				// product id
				$(".editProductFooter").append('<input type="hidden" name="productId" id="productId" value="'+response.product_id+'" />');
				$(".editProductPhotoFooter").append('<input type="hidden" name="productId" id="productId" value="'+response.product_id+'" />');

				// product name
				$("#editProductName").val(response.product_name);
				// quantity
				$("#editQuantity").val(response.quantity);
				// rate
				$("#editRate").val(response.rate);
				// brand name
				$("#editBrandName").val(response.brand_id);
				// category name
				$("#editCategoryName").val(response.categories_id);
				// status
				$("#editProductStatus").val(response.active);

				// update the product data function
				$("#editProductForm").unbind('submit').bind('submit', function() {

					// form validation
					var productImage = $("#editProductImage").val();
					var productName = $("#editProductName").val();
					var quantity = $("#editQuantity").val();
					var rate = $("#editRate").val();
					var brandName = $("#editBrandName").val();
					var categoryName = $("#editCategoryName").val();
					var productStatus = $("#editProductStatus").val();


					if(productName == "") {
						$("#editProductName").after('<p class="text-danger">Product Name field is required</p>');
						$('#editProductName').closest('.form-group').addClass('has-error');
					}	else {
						// remov error text field
						$("#editProductName").find('.text-danger').remove();
						// success out for form
						$("#editProductName").closest('.form-group').addClass('has-success');
					}	// /else

					if(quantity == "") {
						$("#editQuantity").after('<p class="text-danger">Quantity field is required</p>');
						$('#editQuantity').closest('.form-group').addClass('has-error');
					}	else {
						// remov error text field
						$("#editQuantity").find('.text-danger').remove();
						// success out for form
						$("#editQuantity").closest('.form-group').addClass('has-success');
					}	// /else

					if(rate == "") {
						$("#editRate").after('<p class="text-danger">Rate field is required</p>');
						$('#editRate').closest('.form-group').addClass('has-error');
					}	else {
						// remov error text field
						$("#editRate").find('.text-danger').remove();
						// success out for form
						$("#editRate").closest('.form-group').addClass('has-success');
					}	// /else

					if(brandName == "") {
						$("#editBrandName").after('<p class="text-danger">Brand Name field is required</p>');
						$('#editBrandName').closest('.form-group').addClass('has-error');
					}	else {
						// remov error text field
						$("#editBrandName").find('.text-danger').remove();
						// success out for form
						$("#editBrandName").closest('.form-group').addClass('has-success');
					}	// /else

					if(categoryName == "") {
						$("#editCategoryName").after('<p class="text-danger">Category Name field is required</p>');
						$('#editCategoryName').closest('.form-group').addClass('has-error');
					}	else {
						// remov error text field
						$("#editCategoryName").find('.text-danger').remove();
						// success out for form
						$("#editCategoryName").closest('.form-group').addClass('has-success');
					}	// /else

					if(productStatus == "") {
						$("#editProductStatus").after('<p class="text-danger">Product Status field is required</p>');
						$('#editProductStatus').closest('.form-group').addClass('has-error');
					}	else {
						// remov error text field
						$("#editProductStatus").find('.text-danger').remove();
						// success out for form
						$("#editProductStatus").closest('.form-group').addClass('has-success');
					}	// /else

					if(productName && quantity && rate && brandName && categoryName && productStatus) {
						// submit loading button
						$("#editProductBtn").button('loading');

						var form = $(this);
						var formData = new FormData(this);

						$.ajax({
							url : form.attr('action'),
							type: form.attr('method'),
							data: formData,
							dataType: 'json',
							cache: false,
							contentType: false,
							processData: false,
							success:function(response) {
								console.log(response);
								if(response.success == true) {
									// submit loading button
									$("#editProductBtn").button('reset');

									$("html, body, div.modal, div.modal-content, div.modal-body").animate({scrollTop: '0'}, 100);

									// shows a successful message after operation
									$('#edit-product-messages').html('<div class="alert alert-success">'+
				            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
				            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
				          '</div>');

									// remove the mesages
				          $(".alert-success").delay(500).show(10, function() {
										$(this).delay(3000).hide(10, function() {
											$(this).remove();
										});
									}); // /.alert

				          // reload the manage student table
									manageProductTable.ajax.reload(null, true);

									// remove text-error
									$(".text-danger").remove();
									// remove from-group error
									$(".form-group").removeClass('has-error').removeClass('has-success');

								} // /if response.success

							} // /success function
						}); // /ajax function
					}	 // /if validation is ok

					return false;
				}); // update the product data function

				// update the product image
				$("#updateProductImageForm").unbind('submit').bind('submit', function() {
					// form validation
					var productImage = $("#editProductImage").val();

					if(productImage == "") {
						$("#editProductImage").closest('.center-block').after('<p class="text-danger">Product Image field is required</p>');
						$('#editProductImage').closest('.form-group').addClass('has-error');
					}	else {
						// remov error text field
						$("#editProductImage").find('.text-danger').remove();
						// success out for form
						$("#editProductImage").closest('.form-group').addClass('has-success');
					}	// /else

					if(productImage) {
						// submit loading button
						$("#editProductImageBtn").button('loading');

						var form = $(this);
						var formData = new FormData(this);

						$.ajax({
							url : form.attr('action'),
							type: form.attr('method'),
							data: formData,
							dataType: 'json',
							cache: false,
							contentType: false,
							processData: false,
							success:function(response) {

								if(response.success == true) {
									// submit loading button
									$("#editProductImageBtn").button('reset');

									$("html, body, div.modal, div.modal-content, div.modal-body").animate({scrollTop: '0'}, 100);

									// shows a successful message after operation
									$('#edit-productPhoto-messages').html('<div class="alert alert-success">'+
				            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
				            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
				          '</div>');

									// remove the mesages
				          $(".alert-success").delay(500).show(10, function() {
										$(this).delay(3000).hide(10, function() {
											$(this).remove();
										});
									}); // /.alert

				          // reload the manage student table
									manageProductTable.ajax.reload();

									$(".fileinput-remove-button").click();

									$.ajax({
										url: 'product/fetchProductImageUrl?i='+productId,
										type: 'post',
										success:function(response) {
										$("#getProductImage").attr('src', response);
										}
									});

									// remove text-error
									$(".text-danger").remove();
									// remove from-group error
									$(".form-group").removeClass('has-error').removeClass('has-success');

								} // /if response.success

							} // /success function
						}); // /ajax function
					}	 // /if validation is ok

					return false;
				}); // /update the product image

			});
			} // /success function
		}); // /ajax to fetch product image


	} else {
		alert('error please refresh the page');
	}
} // /edit product function

// remove product
function removeProduct(productId = null) {
	if(productId) {
		// remove product button clicked
		$("#removeProductBtn").unbind('click').bind('click', function() {
			// loading remove button
			$("#removeProductBtn").button('loading');
			$.ajax({
				url: 'product/removeProduct',
				type: 'post',
				data: {productId: productId},
				dataType: 'json',
				success:function(response) {
					// loading remove button
					$("#removeProductBtn").button('reset');
					if(response.success == true) {
						// remove product modal
						$("#removeProductModal").modal('hide');

						// update the product table
						manageProductTable.ajax.reload();

						// remove success messages
						$(".remove-messages").html('<div class="alert alert-success">'+
		            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
		            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
		          '</div>');

						// remove the mesages
	          $(".alert-success").delay(500).show(10, function() {
							$(this).delay(3000).hide(10, function() {
								$(this).remove();
							});
						}); // /.alert
					} else {

						// remove success messages
						$(".removeProductMessages").html('<div class="alert alert-success">'+
		            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
		            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
		          '</div>');

						// remove the mesages
	          $(".alert-success").delay(500).show(10, function() {
							$(this).delay(3000).hide(10, function() {
								$(this).remove();
							});
						}); // /.alert

					} // /error
				} // /success function
			}); // /ajax fucntion to remove the product
			return false;
		}); // /remove product btn clicked
	} // /if productid
} // /remove product function

function clearForm(oForm) {
}



var manageOrderTable;


// Order Page
function addRow() {
	$("#addRowBtn").button("loading");

	var tableLength = $("#productTable tbody tr").length;

	var tableRow;
	var arrayNumber;
	var count;

	if(tableLength > 0) {
		tableRow = $("#productTable tbody tr:last").attr('id');
		arrayNumber = $("#productTable tbody tr:last").attr('class');
		count = tableRow.substring(3);
		count = Number(count) + 1;
		arrayNumber = Number(arrayNumber) + 1;
	} else {
		// no table row
		count = 1;
		arrayNumber = 0;
	}

	$.ajax({
		url: url+'order/fetchProductData',
		type: 'post',
		dataType: 'json',
		success:function(response) {
			$("#addRowBtn").button("reset");

			var tr = '<tr id="row'+count+'" class="'+arrayNumber+'">'+
				'<td>'+
					'<div class="form-group">'+

					'<select class="form-control" name="productName[]" id="productName'+count+'" onchange="getProductData('+count+')" >'+
						'<option value="">~~SELECT~~</option>';
						// console.log(response);
						$.each(response, function(index, value) {
							tr += '<option value="'+value.product_id+'">'+value.product_name+'</option>';
						});

					tr += '</select>'+
					'</div>'+
				'</td>'+
				'<td style="padding-left:20px;"">'+
					'<input type="text" name="rate[]" id="rate'+count+'" autocomplete="off" disabled="true" class="form-control" />'+
					'<input type="hidden" name="rateValue[]" id="rateValue'+count+'" autocomplete="off" class="form-control" />'+
				'</td style="padding-left:20px;">'+
				'<td style="padding-left:20px;">'+
					'<div class="form-group">'+
					'<input type="number" name="quantity[]" id="quantity'+count+'" onkeyup="getTotal('+count+')" autocomplete="off" class="form-control" min="1" />'+
					'</div>'+
				'</td>'+
				'<td style="padding-left:20px;">'+
					'<input type="text" name="total[]" id="total'+count+'" autocomplete="off" class="form-control" disabled="true" />'+
					'<input type="hidden" name="totalValue[]" id="totalValue'+count+'" autocomplete="off" class="form-control" />'+
				'</td>'+
				'<td>'+
					'<button class="btn btn-default removeProductRowBtn" type="button" onclick="removeProductRow('+count+')"><i class="glyphicon glyphicon-trash"></i></button>'+
				'</td>'+
			'</tr>';
			if(tableLength > 0) {
				$("#productTable tbody tr:last").after(tr);
			} else {
				$("#productTable tbody").append(tr);
			}

		} // /success
	});	// get the product data

} // /add row

function removeProductRow(row = null) {
	if(row) {
		$("#row"+row).remove();


		subAmount();
	} else {
		alert('error! Refresh the page again');
	}
}



// select on product data
function getProductData(row = null) {
	if(row) {
		var productId = $("#productName"+row).val();

		if(productId == "") {
			$("#rate"+row).val("");

			$("#quantity"+row).val("");
			$("#total"+row).val("");

		} else {

			$.ajax({
				url: url+'product/fetchSelectedProduct',
				type: 'post',
				data: {productId : productId},
				dataType: 'json',
				success:function(result) {
					// setting the rate value into the rate input field
					$.each(result,function(index, response){

						$("#rate"+row).val(response.rate);
						$("#rateValue"+row).val(response.rate);

						$("#quantity"+row).val(1);

						var total = Number(response.rate) * 1;
						total = total.toFixed(2);
						$("#total"+row).val(total);
						$("#totalValue"+row).val(total);

					});

					subAmount();
				} // /success
			}); // /ajax function to fetch the product data
		}

	} else {
		alert('no row! please refresh the page');
	}
} // /select on product data

// table total
function getTotal(row = null) {
	if(row) {
		var total = Number($("#rate"+row).val()) * Number($("#quantity"+row).val());
		total = total.toFixed(2);
		$("#total"+row).val(total);
		$("#totalValue"+row).val(total);

		subAmount();

	} else {
		alert('no row !! please refresh the page');
	}
}

function subAmount() {
	var tableProductLength = $("#productTable tbody tr").length;
	var totalSubAmount = 0;
	for(x = 0; x < tableProductLength; x++) {
		var tr = $("#productTable tbody tr")[x];
		var count = $(tr).attr('id');
		count = count.substring(3);

		totalSubAmount = Number(totalSubAmount) + Number($("#total"+count).val());
	} // /for

	totalSubAmount = totalSubAmount.toFixed(2);

	// sub total
	$("#subTotal").val(totalSubAmount);
	$("#subTotalValue").val(totalSubAmount);

	// vat
	var vat = (Number($("#subTotal").val())/100) * 13;
	vat = vat.toFixed(2);
	$("#vat").val(vat);
	$("#vatValue").val(vat);

	// total amount
	var totalAmount = (Number($("#subTotal").val()) + Number($("#vat").val()));
	totalAmount = totalAmount.toFixed(2);
	$("#totalAmount").val(totalAmount);
	$("#totalAmountValue").val(totalAmount);

	var discount = $("#discount").val();
	if(discount) {
		var grandTotal = Number($("#totalAmount").val()) - Number(discount);
		grandTotal = grandTotal.toFixed(2);
		$("#grandTotal").val(grandTotal);
		$("#grandTotalValue").val(grandTotal);
	} else {
		$("#grandTotal").val(totalAmount);
		$("#grandTotalValue").val(totalAmount);
	} // /else discount

	var paidAmount = $("#paid").val();
	if(paidAmount) {
		paidAmount =  Number($("#grandTotal").val()) - Number(paidAmount);
		paidAmount = paidAmount.toFixed(2);
		$("#due").val(paidAmount);
		$("#dueValue").val(paidAmount);
	} else {
		$("#due").val($("#grandTotal").val());
		$("#dueValue").val($("#grandTotal").val());
	} // else

} // /sub total amount

function discountFunc() {
	var discount = $("#discount").val();
 	var totalAmount = Number($("#totalAmount").val());
 	totalAmount = totalAmount.toFixed(2);

 	var grandTotal;
 	if(totalAmount) {
 		grandTotal = Number($("#totalAmount").val()) - Number($("#discount").val());
 		grandTotal = grandTotal.toFixed(2);

 		$("#grandTotal").val(grandTotal);
 		$("#grandTotalValue").val(grandTotal);
 	} else {
 	}

 	var paid = $("#paid").val();

 	var dueAmount;
 	if(paid) {
 		dueAmount = Number($("#grandTotal").val()) - Number($("#paid").val());
 		dueAmount = dueAmount.toFixed(2);

 		$("#due").val(dueAmount);
 		$("#dueValue").val(dueAmount);
 	} else {
 		$("#due").val($("#grandTotal").val());
 		$("#dueValue").val($("#grandTotal").val());
 	}

} // /discount function

function paidAmount() {
	var grandTotal = $("#grandTotal").val();

	if(grandTotal) {
		var dueAmount = Number($("#grandTotal").val()) - Number($("#paid").val());
		dueAmount = dueAmount.toFixed(2);
		$("#due").val(dueAmount);
		$("#dueValue").val(dueAmount);
	} // /if
} // /paid amoutn function


function resetOrderForm() {
	// reset the input field
	$("#createOrderForm")[0].reset();
	// remove remove text danger
	$(".text-danger").remove();
	// remove form group error
	$(".form-group").removeClass('has-success').removeClass('has-error');
} // /reset order form


$(document).ready(function(){
	// order date picker
	$("#orderDate").datepicker();
	// Save Order

	$('#topNavAddOrder').addClass('active');


	// create order form function
	$("#createOrderForm").unbind('submit').bind('submit', function() {
		var form = $(this);

		$('.form-group').removeClass('has-error').removeClass('has-success');
		$('.text-danger').remove();

		var orderDate = $("#orderDate").val();
		var clientName = $("#clientName").val();
		var clientContact = $("#clientContact").val();
		var paid = $("#paid").val();
		var discount = $("#discount").val();
		var paymentType = $("#paymentType").val();
		var paymentStatus = $("#paymentStatus").val();

		// form validation
		if(orderDate == "") {
			$("#orderDate").after('<p class="text-danger"> The Order Date field is required </p>');
			$('#orderDate').closest('.form-group').addClass('has-error');
		} else {
			$('#orderDate').closest('.form-group').addClass('has-success');
		} // /else

		if(clientName == "") {
			$("#clientName").after('<p class="text-danger"> The Client Name field is required </p>');
			$('#clientName').closest('.form-group').addClass('has-error');
		} else {
			$('#clientName').closest('.form-group').addClass('has-success');
		} // /else

		if(clientContact == "") {
			$("#clientContact").after('<p class="text-danger"> The Contact field is required </p>');
			$('#clientContact').closest('.form-group').addClass('has-error');
		} else {
			$('#clientContact').closest('.form-group').addClass('has-success');
		} // /else

		if(paid == "") {
			$("#paid").after('<p class="text-danger"> The Paid field is required </p>');
			$('#paid').closest('.form-group').addClass('has-error');
		} else {
			$('#paid').closest('.form-group').addClass('has-success');
		} // /else

		if(discount == "") {
			$("#discount").after('<p class="text-danger"> The Discount field is required </p>');
			$('#discount').closest('.form-group').addClass('has-error');
		} else {
			$('#discount').closest('.form-group').addClass('has-success');
		} // /else

		if(paymentType == "") {
			$("#paymentType").after('<p class="text-danger"> The Payment Type field is required </p>');
			$('#paymentType').closest('.form-group').addClass('has-error');
		} else {
			$('#paymentType').closest('.form-group').addClass('has-success');
		} // /else

		if(paymentStatus == "") {
			$("#paymentStatus").after('<p class="text-danger"> The Payment Status field is required </p>');
			$('#paymentStatus').closest('.form-group').addClass('has-error');
		} else {
			$('#paymentStatus').closest('.form-group').addClass('has-success');
		} // /else


		// array validation
		var productName = document.getElementsByName('productName[]');
		var validateProduct;
		for (var x = 0; x < productName.length; x++) {
			var productNameId = productName[x].id;
			if(productName[x].value == ''){
				$("#"+productNameId+"").after('<p class="text-danger"> Product Name Field is required!! </p>');
				$("#"+productNameId+"").closest('.form-group').addClass('has-error');
			} else {
				$("#"+productNameId+"").closest('.form-group').addClass('has-success');
			}
		} // for

		for (var x = 0; x < productName.length; x++) {
			if(productName[x].value){
				validateProduct = true;
			} else {
				validateProduct = false;
			}
		} // for

		var quantity = document.getElementsByName('quantity[]');
		var validateQuantity;
		for (var x = 0; x < quantity.length; x++) {
			var quantityId = quantity[x].id;
			if(quantity[x].value == ''){
				$("#"+quantityId+"").after('<p class="text-danger"> Product Quantity Field is required!! </p>');
				$("#"+quantityId+"").closest('.form-group').addClass('has-error');
			} else {
				$("#"+quantityId+"").closest('.form-group').addClass('has-success');
			}
		}  // for

		for (var x = 0; x < quantity.length; x++) {
			if(quantity[x].value){
				validateQuantity = true;
			} else {
				validateQuantity = false;
			}
		} // for


		if(orderDate && clientName && clientContact && paid && discount && paymentType && paymentStatus) {
			if(validateProduct == true && validateQuantity == true) {
				// create order button
				// $("#createOrderBtn").button('loading');

				$.ajax({
					url : form.attr('action'),
					type: form.attr('method'),
					data: form.serialize(),
					dataType: 'json',
					success:function(response) {
						console.log(response);
						// reset button
						$("#createOrderBtn").button('reset');

						$(".text-danger").remove();
						$('.form-group').removeClass('has-error').removeClass('has-success');

						if(response.success == true) {

							// create order button
							$(".success-messages").html('<div class="alert alert-success">'+
							'<button type="button" class="close" data-dismiss="alert">&times;</button>'+
							'<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
							' <br /> <br /> <a type="button" onclick="printOrder('+response.order_id+')" class="btn btn-primary"> <i class="glyphicon glyphicon-print"></i> Print </a>'+
							'<a href="orders.php?o=add" class="btn btn-default" style="margin-left:10px;"> <i class="glyphicon glyphicon-plus-sign"></i> Add New Order </a>'+

						 '</div>');

						$("html, body, div.panel, div.pane-body").animate({scrollTop: '0px'}, 100);

						// disabled te modal footer button
						$(".submitButtonFooter").addClass('div-hide');
						// remove the product row
						$(".removeProductRowBtn").addClass('div-hide');

						} else {
							alert(response.messages);
						}
					} // /response
				}); // /ajax
			} // if array validate is true
		} // /if field validate is true


		return false;
	}); // /create order form function


});



// Payment ORDER
function paymentOrder(orderId = null) {

	if(orderId) {

		$("#orderDate").datepicker();
		manageOrderTable  = $('#manageOrderTable').DataTable();

		$.ajax({
			url: url+'order/fetchOrderData',
			type: 'post',
			data: {orderId: orderId},
			dataType: 'json',
			success:function(result) {

				$.each(result,function(index, response){
				// due
				$("#due").val(response.due);

				// pay amount
				$("#payAmount").val(response.due);

				var paidAmount = response.paid;
				var dueAmount = response.due;
				var grandTotal = response.grand_total;

				// update payment
				$("#updatePaymentOrderBtn").unbind('click').bind('click', function() {
					var payAmount = $("#payAmount").val();
					var paymentType = $("#paymentType").val();
					var paymentStatus = $("#paymentStatus").val();

					if(payAmount == "") {
						$("#payAmount").after('<p class="text-danger">The Pay Amount field is required</p>');
						$("#payAmount").closest('.form-group').addClass('has-error');
					} else {
						$("#payAmount").closest('.form-group').addClass('has-success');
					}

					if(paymentType == "") {
						$("#paymentType").after('<p class="text-danger">The Pay Amount field is required</p>');
						$("#paymentType").closest('.form-group').addClass('has-error');
					} else {
						$("#paymentType").closest('.form-group').addClass('has-success');
					}

					if(paymentStatus == "") {
						$("#paymentStatus").after('<p class="text-danger">The Pay Amount field is required</p>');
						$("#paymentStatus").closest('.form-group').addClass('has-error');
					} else {
						$("#paymentStatus").closest('.form-group').addClass('has-success');
					}

					if(payAmount && paymentType && paymentStatus) {
						$("#updatePaymentOrderBtn").button('loading');
						$.ajax({
							url: url+'order/editPayment',
							type: 'post',
							data: {
								orderId: orderId,
								payAmount: payAmount,
								paymentType: paymentType,
								paymentStatus: paymentStatus,
								paidAmount: paidAmount,
								grandTotal: grandTotal
							},
							dataType: 'json',
							success:function(response) {
								$("#updatePaymentOrderBtn").button('loading');

								// remove error
								$('.text-danger').remove();
								$('.form-group').removeClass('has-error').removeClass('has-success');

								$("#paymentOrderModal").modal('hide');

								$("#success-messages").html('<div class="alert alert-success">'+
			            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
			            '<strong><i class="glyphicon glyphicon-ok-sign"></i></strong> '+ response.messages +
			          '</div>');

								// remove the mesages
			          $(".alert-success").delay(500).show(10, function() {
									$(this).delay(3000).hide(10, function() {
										$(this).remove();
									});
								}); // /.alert

			          // refresh the manage order table
								manageOrderTable.ajax.reload();

							} //

						});
					} // /if

					return false;
				}); // /update payment

			}); // /close each statement


			} // /success
		}); // fetch order data
	} else {
		alert('Error ! Refresh the page again');
	}
}

// print order function
function printOrder(orderId = null) {
	if(orderId) {

		$.ajax({
			url: url+'order/printOrder',
			type: 'post',
			data: {orderId: orderId},
			dataType: 'text',
			success:function(response) {

				var mywindow = window.open('','Stock Management System', 'height=400,width=600');
        mywindow.document.write('<html><head><title>Order Invoice</title>');
        mywindow.document.write('</head><body>');
        mywindow.document.write(response);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        mywindow.close();

			}// /success function
		}); // /ajax function to fetch the printable order
	} // /if orderId
} // /print order function
