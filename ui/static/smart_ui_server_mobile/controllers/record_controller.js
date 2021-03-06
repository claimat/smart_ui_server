/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server_mobile.Controllers.Record',
/* @Static */
{

},
/* @Prototype */
{	
    	
   init: function(params) {
	this.RECENT_RECORDS = {};
	this.current_patient_label = $('#current_patient');
	this.current_patient_label.text("");
},
    
    'patient_record.selected subscribe': function(topic, record_id) {
    	this.RECORD_ID = record_id;		  
	    this._load_record();
	}, 

  after_record_obtained: function(record) {

	  RecordController.CURRENT_RECORD = record;
 	  this.current_patient_label.html("<a id='prev_pt' href='#prev_pt_req' title='Previous Patient Record'>&lt;</a>"+
					  "<span id='pt_label'>"+record.label+"</span>"+
					  "<a id='next_pt' href='#next_pt_req' title='Next Patient Record'>&gt;</a>");

	  OpenAjax.hub.publish("pha.exit_app_context");
	  SMART.record_context_changed();

	  // If there was an app open on the old record, open it automatically
	  // on the new one.
	  if (RecordController.APP_ID) {
	      var app = $.grep(PHAController.phas, function(pha) {return (pha.id === RecordController.APP_ID);})[0];
	      OpenAjax.hub.publish("pha.launch", app);
	  } else if (RecordController.PAGE) {
	      RecordController.PAGE.index();
	  }

  },
  
  _load_record: function() {
      var record_id = this.RECORD_ID;
	  // if the 'new' selection ain't new, we're done here.
	  if ( this.CURRENT_RECORD && record_id == this.CURRENT_RECORD.record_id ) {
		  return;
	  }
	  
	  var already_obtained = RecordController.RECENT_RECORDS[record_id];
	  
	  if (already_obtained)
		  this.after_record_obtained(already_obtained);
      else
    	  Record.get(record_id,this.callback(after_record_obtained));
    }
 
});