$(document).ready(function(){
    $("#inputstats").click(function(){
        $(".inputcandidate").slideToggle(1000);
    });

    $("#selectuser").click(function(){
        $(".selectcandidate").show(1000);
    });
	$("#pass,#confirm").passy(function( strength, valid ) {
	
	// Set color basd on validness and strength
		if( valid ) {
			if( strength < $.passy.strength.HIGH ) {
				color = 'orange';
			} else {
			color = 'green';
			}
		} else {
		color = 'red';
		}
		$( this ).css( 'background-color', color );
	});
	$(".form-group").change(function(){
        $(this).fadeTo("slow", .4);
    });
    $(".control-option").click(function(){
        $(this).fancySelect();
    });
    $(".form-control").change(function(){
        $(this).fadeTo("slow", .4);
    });

$("#submitbutton").click(function(){
    var obj = {}
    obj.height =                            parseFloat($('#height').value); // all these numbers could be NaN
    if ($('#heightmeasure').value == "inches") {
        obj.height *= 2.54;
    }
    obj.age =                               parseFloat($('#age').value);
    obj.weight =                            parseFloat($('#weight').value);
    if ($('#weightmeasure').value == "pound") {
        obj.weight *= 0.453592;
    }
    obj.gender =                                       $('#gender').value; // this one is a string
    obj.sitting_systolic_blood_pressure =   parseFloat($('#systolicbloodpressure').value);
    obj.sitting_diatolic_blood_pressure =   parseFloat($('#diatolicbloodpressure').value);
    obj.sitting_heart_rate =                parseFloat($('#bpm').value);
    obj.energy_intake =                     parseFloat($('#calories').value);
    obj.fluid_intake =                      parseFloat($('#waterintake').value);
    if ($('#water-intake-measure').value == "Gallons") {
        obj.fluid_intake *= 3.78541;
    }
    obj.situps_in_a_minute =                parseFloat($('#situps').value);
    obj.pushups_in_a_minute =               parseFloat($('#pushups').value);
    obj.one_mile_run =                      parseFloat($('#onemilerun').value);
    //var encodedString = JSON.stringify(obj);
    $.post("http://107.170.101.126:8080/data/workAround/",obj,function(data,status){/* nothing to do here */});
    });


    $("#datapointbutton").click(function(){
    var obj = {}
    obj.weight =                            parseFloat($('#weight').value);
    if ($('#weightmeasure').value == "pound") {
        obj.weight *= 0.453592;
    }
    obj.sitting_systolic_blood_pressure =   parseFloat($('#systolicbloodpressure').value);
    obj.sitting_heart_rate =                parseFloat($('#bpm').value);
    obj.energy_intake =                     parseFloat($('#calories').value);
    obj.situps_in_a_minute =                parseFloat($('#situps').value);
    obj.pushups_in_a_minute =               parseFloat($('#pushups').value);
    obj.one_mile_run =                      parseFloat($('#onemilerun').value);
    //var encodedString = JSON.stringify(obj);
    $.post("http://107.170.101.126:8080/data/workAround/",obj,function(data,status){/* nothing to do here */});
    });
});
