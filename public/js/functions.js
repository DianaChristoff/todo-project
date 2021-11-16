    function editTask($id) {
        $item = document.getElementById($id);
        $($id).append('<li class="list-group-item collapse" id="new_task_tab"><div class="custom-checkbox-grid"><label for="new_task" class="check"><svg width="25px" height="25px" viewBox="0 0 30 30"><path d="M1,15 L1,6 C1,3.5 3.5,1 6,1 L24,1 C26.5,1 29,2 29,6 L29,24 C29,27 27,29 24,29 L6,29 C3.5,29 1,27 1,24 L1,15 Z"></path><polyline points="1 15 12 24 26 7"></polyline></svg></label><input type="text" class="col-md-9" id="new_task" style="margin-left: 5px;"><div class="task-menu"><span class="material-icons" style="font-weight: 800;"> done</span><span class="material-icons" style="font-weight: 800;"> close </span></div></div></li>')
    }

    function addNewTask() {
        $('#addTaskModal').submit(function (e) { e.preventDefault() });
        $task=$('#new_task').val();
        $dateInput=$('#date').val().split('/');
        $date=$dateInput[2]+'/'+$dateInput[1]+'/'+$dateInput[0];

        if($('#date').val()!=''){
            $.ajaxSetup({
                headers:
                    { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
            });

            $.ajax({
                type: "POST",
                url: '/task/add',
                data: {content:$task, date:$date},
                success: function (response) {
                    $tmp='<div class="card"><div class="card-header" id="heading_'+response.task._id+'"style="color:black;display: flex;justify-content: space-between;padding: 15px;">'+
                        '<input type="checkbox" class="cbx" id="task_'+response.task._id+'"  onclick="changeTaskStatus(this)" style="display:none"';

                    if(response.task.completed) $tmp+='checked'; else $tmp+='';

                    $tmp+='><label for="task_'+response.task._id+'" id="task_label_'+response.task._id+'" class="check"><svg width="25px" height="25px" viewBox="0 0 30 30">'+
                        '<path d="M1,15 L1,6 C1,3.5 3.5,1 6,1 L24,1 C26.5,1 29,2 29,6 L29,24 C29,27 27,29 24,29 L6,29 C3.5,29 1,27 1,24 L1,15 Z"></path><polyline points="1 15 12 24 26 7"></polyline>'+
                        '</svg><span class="task-label Task Label mx-3">'+response.task.content+'</span></label><div class="task-menu"><span class="material-icons" data-toggle="collapse"  data-target="#collapse_'+
                        response.task._id+'"aria-expanded="false" aria-controls="collapse_'+response.task._id+'" aria-hidden="true" style="background-color:unset !important;">edit</span><span onclick="removeTask(\''+
                        response.task._id+'\')" aria-hidden="true" class="material-icons"> delete </span></div></div><div id="collapse_'+response.task._id+'" class="collapse" aria-labelledby="heading_'+
                        response.task._id+'" data-parent="#accordionExample"><div class="card-body" style="color:black;display: flex;justify-content: space-around;"><input type="text" class="col-md-10" id="task_edit_'+
                        response.task._id+'" value="'+response.task.content+'" style="margin-left: 5px;border: 0;border-bottom: 1px solid black;line-height: 1.5;font-size: 1.2rem;">'+
                        '<div class="task-menu"><span class="material-icons" onclick="editTask(\''+response.task._id+'\')" aria-hidden="true" style="font-weight: bolder;">done</span>'+ 
                        '<span class="material-icons"  data-toggle="collapse" data-target="#collapse_'+response.task._id+'"aria-expanded="false" aria-controls="collapse_'+response.task._id+
                        '" aria-hidden="true" style="font-weight: bolder;">clear</span></div></div></div></div>';

                    num_of_entries = $('.card');

    
                    if(num_of_entries.length==0){
                        $('#accordionExample').html($tmp);   
                    }else{
                        $('#accordionExample').append($tmp);   
                    }
                    console.log($('#entry_id').val());
                    console.log(response);

                    if($('#entry_id').val()=='' && response.entry_id.length) {$('#entry_id').val(response.entry_id);}
                
                    toastr.success('Task successfully added!','Success');
                    $task=$('#new_task').val('');
                },
                error: function (response) {
                    toastr["error"](response.responseText, "Error!");
                }
            });
        }else{
            toastr["error"]("You need to enter a date before you can add a task!", "Error!");
        }
    }

    function editTask($id) {
        $task= $('#task_edit_'+$id).val();
        $dateInput=$('#date').val().split('/');
        $date=$dateInput[2]+'/'+$dateInput[1]+'/'+$dateInput[0];


        if($('#date').val()!=''){
            $.ajaxSetup({
                headers:
                    { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
            });

            $.ajax({
                type: "POST",
                url: '/task/edit',
                data: {id:$id, content:$task, date:$date},
                success: function (response) {
                    $('#task_label_'+$id+'> span').html($task); 
                    toastr.success("Task successfully edited!");
                },
                error: function (response) {
                    toastr["error"](response.responseText, "Error!");
                }
            });
        }else{
            toastr["error"]("We couldn't save your changes!Please try again!", "Error!");
        }
    }

    function changeTaskStatus($cb) {
        $task_id= $cb.id.substring(5);
        $value= $cb.checked;

        $.ajaxSetup({
            headers:
                { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
        });

        $.ajax({
            type: "POST",
            url: '/task/complete',
            data: {task:$task_id, value:$value},
            success: function (response) {
                if($value)
                toastr.success('Task successfully completed');
                else 
                toastr.success('Task successfully updated');
            },
            error: function (response) {
                toastr.error(response.responseText , 'Error!');

            }
        });
    }

    function removeTask(id) {
        $.ajaxSetup({
            headers:
                { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
        });

        $.ajax({
            type: "DELETE",
            url: '/task/' + id ,
            success: function (response) {
                $('#heading_'+id).parent().remove();

                toastr["success"]("Task successfully removed!");

                num_of_entries = $('.card');

                if(num_of_entries.length==0){


                    $('#accordionExample').html('<div style="text-align: center;margin: 3vh;font-family: var(--bs-font-sans-serif);color: #929292;font-size: 1.35rem;font-variant: petite-caps;">'+
                    '<strong> You have no added tasks yet.  </strong> <br/><span style="font-size: 1.2rem;font-style: italic;font-variant: none;"> You can add one by clicking on the icon above.'+
                    '</span></div>');
                }
            },
            error: function (response) {
                toastr.error(response.responseText , 'Error!');
            }
        });
    }

    function saveEntry() {
        
        $grat=$('#gratitude').val();
        $achieve=$('#achievement').val();
        $dateInput=$('#date').val().split('/');
        $date=$dateInput[2]+'/'+$dateInput[1]+'/'+$dateInput[0];
        $entry_id=$('#entry_id').val();

        if($('#entry_id').val()==''){
            if($('#date').val()!=''){
                $.ajaxSetup({
                    headers:
                        { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
                });

                $.ajax({
                    type: "POST",
                    url: '/entry/add',
                    data: {gratitude:$grat, achievement:$achieve, date:$date},
                    success: function (response) {
                        $('#entry_id').val(response._id);
                        toastr["success"]("Entry successfully created!");


                    },
                    error: function (response) {
                        toastr.error(response.responseText , 'Error!');
                    }
                });
            }else{
                toastr["error"]("You need to enter a date before you can save your thoughts!", "Error!");
            }
        }else{
           
            if($('#date').val()!=''){
                $.ajaxSetup({
                    headers:
                        { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
                });

                $.ajax({
                    type: "POST",
                    url: '/entry/edit',
                    data: {id:$entry_id,gratitude:$grat, achievement:$achieve, date:$date},
                    success: function (response) {

                        toastr["success"]("Entry successfully updated!");
                    },
                    error: function (response) {
                        toastr.error(response.responseText , 'Error!');
                    }
                });
            }else{
                toastr["error"]("Your entry needs to have a date!", "Error!");
            }
        }
    }

    function removeEntry(id) {
        $.ajaxSetup({
            headers:
                { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
        });

        $.ajax({
            type: "DELETE",
            url: '/entry/'+ id,
            success: function (response) {
                $('#entry_'+id).parent().remove();

                toastr["success"]("Entry successfully removed!");

                num_of_entries = $('.card');

                if(num_of_entries.length==0){
                    $('#entry_list').html('<div style="text-align: center;margin: 7vh;font-family: var(--bs-font-sans-serif);color: #929292;font-size: 1.35rem;font-variant: petite-caps;">'+
                    '<strong> You have no added entries yet.</strong> <br/><span style="font-size: 1.2rem;font-style: italic;font-variant: none;"> You can add one by clicking on the icon above. </span>'+
                    '</div>');
                }

            },
            error: function (response) {
                toastr.error(response.responseText , 'Error!');
            }
        });
       
    }
