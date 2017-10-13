var rightTools = null;
var berthPositionModal = null;

$(function(){
  var strDate = '2016-10-22', number = 9;
  var berthData = {
    "0042RL": [{
      "id": 0,
      "idx": 0,
      "name": "A1",
      "start_postion": 0,
      "end_position": 365,
      "from_bitt": 1,
      "to_bitt": 14,
      "group": "NALT",
      "length": 365,
      "depth": null,
      "direction": "0042RL"
    }], "berth_total_width": 365
  }
  var bitts =  [{"id":0,"idx":0,"name":"01","start_position":2850,"end_position":null,"start_position_original":0,"end_position_original":null,"berth_idx":"0"},{"id":1,"idx":1,"name":"02","start_position":2771.3999999999996,"end_position":null,"start_position_original":26.2,"end_position_original":null,"berth_idx":"0"},{"id":2,"idx":2,"name":"03","start_position":2693.3999999999996,"end_position":null,"start_position_original":52.2,"end_position_original":null,"berth_idx":"0"},{"id":3,"idx":3,"name":"04","start_position":2615.1000000000004,"end_position":null,"start_position_original":78.3,"end_position_original":null,"berth_idx":"0"},{"id":4,"idx":4,"name":"05","start_position":2536.8,"end_position":null,"start_position_original":104.4,"end_position_original":null,"berth_idx":"0"},{"id":5,"idx":5,"name":"06","start_position":2458.5,"end_position":null,"start_position_original":130.5,"end_position_original":null,"berth_idx":"0"},{"id":6,"idx":6,"name":"07","start_position":2380.5,"end_position":null,"start_position_original":156.5,"end_position_original":null,"berth_idx":"0"},{"id":7,"idx":7,"name":"08","start_position":2302.2,"end_position":null,"start_position_original":182.6,"end_position_original":null,"berth_idx":"0"},{"id":8,"idx":8,"name":"09","start_position":2223.8999999999996,"end_position":null,"start_position_original":208.7,"end_position_original":null,"berth_idx":"0"},{"id":9,"idx":9,"name":"10","start_position":2145.8999999999996,"end_position":null,"start_position_original":234.7,"end_position_original":null,"berth_idx":"0"},{"id":10,"idx":10,"name":"11","start_position":2067.6000000000004,"end_position":null,"start_position_original":260.8,"end_position_original":null,"berth_idx":"0"},{"id":11,"idx":11,"name":"12","start_position":1989.33,"end_position":null,"start_position_original":286.89,"end_position_original":null,"berth_idx":"0"},{"id":12,"idx":12,"name":"13","start_position":1911,"end_position":null,"start_position_original":313,"end_position_original":null,"berth_idx":"0"},{"id":13,"idx":13,"name":"14","start_position":1833,"end_position":null,"start_position_original":339,"end_position_original":null,"berth_idx":"0"},{"id":14,"idx":14,"name":"15","start_position":1755,"end_position":null,"start_position_original":365,"end_position_original":null,"berth_idx":"0"},{"id":0,"idx":0,"name":"15","start_position":1755,"end_position":null,"start_position_original":365,"end_position_original":null,"berth_idx":"1"},{"id":1,"idx":1,"name":"16","start_position":1689,"end_position":null,"start_position_original":387,"end_position_original":null,"berth_idx":"1"},{"id":2,"idx":2,"name":"17","start_position":1623.3000000000002,"end_position":null,"start_position_original":408.9,"end_position_original":null,"berth_idx":"1"},{"id":3,"idx":3,"name":"18","start_position":1557.3000000000002,"end_position":null,"start_position_original":430.9,"end_position_original":null,"berth_idx":"1"},{"id":4,"idx":4,"name":"19","start_position":1491.6,"end_position":null,"start_position_original":452.8,"end_position_original":null,"berth_idx":"1"},{"id":5,"idx":5,"name":"20","start_position":1425.9,"end_position":null,"start_position_original":474.7,"end_position_original":null,"berth_idx":"1"},{"id":6,"idx":6,"name":"21","start_position":1360.1999999999998,"end_position":null,"start_position_original":496.6,"end_position_original":null,"berth_idx":"1"},{"id":7,"idx":7,"name":"22","start_position":1294.1999999999998,"end_position":null,"start_position_original":518.6,"end_position_original":null,"berth_idx":"1"},{"id":8,"idx":8,"name":"23","start_position":1228.5,"end_position":null,"start_position_original":540.5,"end_position_original":null,"berth_idx":"1"},{"id":9,"idx":9,"name":"24","start_position":1162.8000000000002,"end_position":null,"start_position_original":562.4,"end_position_original":null,"berth_idx":"1"},{"id":10,"idx":10,"name":"25","start_position":1097.1000000000001,"end_position":null,"start_position_original":584.3,"end_position_original":null,"berth_idx":"1"},{"id":11,"idx":11,"name":"26","start_position":1031.1000000000001,"end_position":null,"start_position_original":606.3,"end_position_original":null,"berth_idx":"1"},{"id":12,"idx":12,"name":"27","start_position":965.3999999999999,"end_position":null,"start_position_original":628.2,"end_position_original":null,"berth_idx":"1"},{"id":0,"idx":0,"name":"28","start_position":900,"end_position":null,"start_position_original":650,"end_position_original":null,"berth_idx":"2"},{"id":1,"idx":1,"name":"29","start_position":830.3999999999999,"end_position":null,"start_position_original":673.2,"end_position_original":null,"berth_idx":"2"},{"id":2,"idx":2,"name":"30","start_position":761.1000000000001,"end_position":null,"start_position_original":696.3,"end_position_original":null,"berth_idx":"2"},{"id":3,"idx":3,"name":"31","start_position":692.1000000000001,"end_position":null,"start_position_original":719.3,"end_position_original":null,"berth_idx":"2"},{"id":4,"idx":4,"name":"32","start_position":622.8000000000001,"end_position":null,"start_position_original":742.4,"end_position_original":null,"berth_idx":"2"},{"id":5,"idx":5,"name":"33","start_position":553.5,"end_position":null,"start_position_original":765.5,"end_position_original":null,"berth_idx":"2"},{"id":6,"idx":6,"name":"34","start_position":484.19999999999993,"end_position":null,"start_position_original":788.6,"end_position_original":null,"berth_idx":"2"},{"id":7,"idx":7,"name":"35","start_position":415.19999999999993,"end_position":null,"start_position_original":811.6,"end_position_original":null,"berth_idx":"2"},{"id":8,"idx":8,"name":"36","start_position":345.89999999999986,"end_position":null,"start_position_original":834.7,"end_position_original":null,"berth_idx":"2"},{"id":9,"idx":9,"name":"37","start_position":276.60000000000014,"end_position":null,"start_position_original":857.8,"end_position_original":null,"berth_idx":"2"},{"id":10,"idx":10,"name":"38","start_position":207.30000000000007,"end_position":null,"start_position_original":880.9,"end_position_original":null,"berth_idx":"2"},{"id":11,"idx":11,"name":"39","start_position":138.30000000000007,"end_position":null,"start_position_original":903.9,"end_position_original":null,"berth_idx":"2"},{"id":12,"idx":12,"name":"40","start_position":69,"end_position":null,"start_position_original":927,"end_position_original":null,"berth_idx":"2"}]
  var vesselData = [{
    "id": "CAT00100012016",
    "berth_id": "0",
    "code": "CAT001/0001/2016",
    "vsl_voy_no": "CAT001/0001/2016",
    "name": "CATTLEYA ACE",
    "LOA": 199.99,
    "LBP": 0,
    "bridge_to_stern": 170,
    "vessel_color": "#a6eb12",
    "calling_status_color": "#a6eb12",
    "calling_type_color": "",
    "service_lane_color": "",
    "along_side": "0123P",
    "along_side_name": "P",
    "head_position": 296,
    "berth_dir_cd": "0042RL",
    "status": "P",
    "status_code": "0103P",
    "eta_date": "22/10/2016 00:00",
    "etb_date": "22/10/2016 03:30",
    "etd_date": "23/10/2016 16:00",
    "ata_date": "",
    "atb_date": "",
    "atd_date": "",
    "stern_ramp": {
      "ramp_width": 5,
      "ramp_start_position": 3,
      "ramp_degree": 150,
      "ramp_occupied_distance": 10
    },
    "side_ramp": {
      "ramp_width": 8,
      "ramp_start_position": 100,
      "ramp_degree": 90,
      "ramp_occupied_distance": 8
    },
    "operator_cd": "NYK",
    "mooring_head": "13",
    "mooring_stern": "2",
    "volume_d": "0",
    "volume_l": "0",
    "volume_r": "0",
    "data_error": false,
    "vsl_tp_nm": "PCTC(RORO)",
    "vsl_opr_nm": "NYK LINE (THAILAND) CO.,LTD."
  }, {
    "id": "MON00200042016",
    "berth_id": "0",
    "code": "MON002/0004/2016",
    "vsl_voy_no": "MON002/0004/2016",
    "name": "MONZA EXPRESS",
    "LOA": 168.06,
    "LBP": 0,
    "bridge_to_stern": 145,
    "vessel_color": "#a6eb12",
    "calling_status_color": "#a6eb12",
    "calling_type_color": "",
    "service_lane_color": "",
    "along_side": "0123S",
    "along_side_name": "S",
    "head_position": 100,
    "berth_dir_cd": "0042RL",
    "status": "P",
    "status_code": "0103P",
    "eta_date": "24/10/2016 00:00",
    "etb_date": "24/10/2016 10:00",
    "etd_date": "24/10/2016 17:00",
    "ata_date": "",
    "atb_date": "",
    "atd_date": "",
    "operator_cd": "NYK",
    "mooring_head": "1",
    "mooring_stern": "9",
    "volume_d": "0",
    "volume_l": "0",
    "volume_r": "0",
    "data_error": false,
    "vsl_tp_nm": "PCTC(RORO)",
    "vsl_opr_nm": "NYK LINE (THAILAND) CO.,LTD."
  }]

  var data = {
    fromDate: strDate,
    totalDate: number,
    vslData: vesselData
  }

  //init plugin
  $("#berth-position-calc").berthPositionCalc({
    berthPosition: '0119H',
    data: {
      mooringDistance: 20,
      isClose: false,
      bittData: bitts
    },
    onPositionCalculated: function (event, data){
      console.log("data: ", data);
      if(data.error){
        console.log("error");
        return;
      }
      let vslData = data.vslData;
      rightTools.removeVessel(vslData.id);
      berthPositionModal.close();
    }
  });
  berthPositionModal = $("#berth-position-calc").data('berthPositionCalc');

  $("#berth-right-tools").berthRightTools({
    width: 350,
    height: 800,
    top: "5%",
    isTabWindow: true,
    data: data,
    onVslDblClick: function(event, data){
      berthPositionModal.open(data);
    },
  });
  // The instance is also saved in the DOM elements data,
  // and accessible using the plugin's id 'berthRightTools'.
  rightTools = $('#berth-right-tools').data('berthRightTools');
  setTimeout(function(){
    rightTools.reLoadData(data);
  }, 1000);
  // $('#berth-right-tools').on('vslSelected', function (event, data){
  //   console.log(data);
  // });
})