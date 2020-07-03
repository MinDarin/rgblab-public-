var setMapInstance = function (map_id, lat, lng) {
	var container = document.getElementById(map_id);
	var option = {
		center: new kakao.maps.LatLng(lat, lng)
		, level:8
	}

	return {
		"container": container
		, "option": option
	}
}

var registerComplaintMap;
var registerPavageMap;

var setMap = function(container, option) {
	var map = new kakao.maps.Map(container, option);
	return map;
}



/*var _kmapInstance = null;

var getKMapInstance = function()
{
	return _kmapInstance;
}

var setKMapInstance = function(container, option)
{	
	_kmapInstance = new kakao.maps.Map(container, option);
}
*/

var _markerPosition  = new kakao.maps.LatLng(35.87, 128.56);

var registerComplaintMarker = new kakao.maps.Marker({
	position: _markerPosition
});

var registerPavageMarker = new kakao.maps.Marker({
        position: _markerPosition
});




// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

function searchDetailAddrFromCoords(coords, callback) {
	// 좌표로 법정동 상세 주소 정보를 요청합니다
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도를 클릭했을때 클릭한 위치에 마커를 추가하도록 지도에 클릭이벤트를 등록합니다
var onClickLocationInMap = function (kmapInstance, marker, inputId)
{
		kakao.maps.event.addListener(kmapInstance, 'click', function(mouseEvent) {
			searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
				if(status === kakao.maps.services.Status.OK) {
					//var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
					//detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

					//var content = '<div class="bAddr">' +	'<span class="title"></span>' + detailAddr + '</div>';
					var addr = result[0].address.address_name;
					console.log(result);
					_markerPosition = mouseEvent.latLng;
					marker.setPosition(_markerPosition);
					document.getElementById(inputId).value = addr;
					//addMarker(kmapInstance, mouseEvent.latLng);
				}
			});
		});

}


// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers = [];

var getMarkers = function() {
	return markers;
}

// 마커를 생성하고 지도위에 표시하는 함수입니다
var addMarker = function (kmapInstance, position) {

	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
		position: position
	}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

	// 마커가 지도 위에 표시되도록 설정합니다
	//marker.setMap(kmapInstance);

	// 생성된 마커를 배열에 추가합니다
	markers.push(marker);
}

// 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
var setMarkers = function(kmapInstance) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(kmapInstance);
	}
}
/*
var postcode = function(inputText) { 
	new daum.Postcode({
		oncomplete: function(data) { // 각 주소의 노출 규칙에 따라 주소를 조합한다. // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다. 
			var fullAddr = data.address; // 최종 주소 변수 
			var extraAddr = ''; // 조합형 주소 변수 // 기본 주소가 도로명 타입일때 조합한다. 
			if(data.addressType === 'R'){ //법정동명이 있을 경우 추가한다. 
				if(data.bname !== ''){ 
					extraAddr += data.bname; 
				} // 건물명이 있을 경우 추가한다. 
				if(data.buildingName !== ''){ 
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName); 
				} // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다. 
				fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : ''); 
			} // 주소 정보를 해당 필드에 넣는다. 
	//document.getElementById("input_address").value = fullAddr; // 주소로 상세 정보를 검색
				inputText.value = fullAddr;
				geocoder.addressSearch(data.address, function(results, status) { // 정상적으로 검색이 완료됐으면 
				if (status === daum.maps.services.Status.OK) { 
					var result = results[0]; //첫번째 결과의 값을 활용 // 해당 주소에 대한 좌표를 받아서 
					var coords = new kakao.maps.LatLng(result.y, result.x); // 지도를 보여준다. 
					//mapContainer.style.display = "block"; map.relayout(); // 지도 중심을 변경한다. 
					//map.setCenter(coords); // 마커를 결과값으로 받은 위치로 옮긴다. 
					_marker.setPosition(coords) 
				} 
			}); 
		} 
	}).open(); 
}
*/

					var postcode = function (layerId, target) {

						var element_layer = document.getElementById(layerId);
						new daum.Postcode({
							oncomplete: function(data) {
								// 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

								// 각 주소의 노출 규칙에 따라 주소를 조합한다.
								// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
								var addr = ''; // 주소 변수
								var extraAddr = ''; // 참고항목 변수

								//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
								if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
									addr = data.roadAddress;
								} else { // 사용자가 지번 주소를 선택했을 경우(J)
									addr = data.jibunAddress;
								}

								// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
								if(data.userSelectedType === 'R'){
									// 법정동명이 있을 경우 추가한다. (법정리는 제외)
									// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
									if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){	extraAddr += data.bname;	}
									// 건물명이 있고, 공동주택일 경우 추가한다.
									if(data.buildingName !== '' && data.apartment === 'Y'){		extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);		}
									// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
									if(extraAddr !== ''){						extraAddr = ' (' + extraAddr + ')';	}
									// 조합된 참고항목을 해당 필드에 넣는다.
									// document.getElementById("sample2_extraAddress").value = extraAddr;
								}	
								else {	;
									//document.getElementById("sample2_extraAddress").value = '';
								}

								// 우편번호와 주소 정보를 해당 필드에 넣는다.
								//document.getElementById('sample2_postcode').value = data.zonecode;
								//document.getElementById("sample2_address").value = addr;
								// 커서를 상세주소 필드로 이동한다.
								//document.getElementById("sample2_detailAddress").focus();

								target.focus();
								var addrStr = addr + extraAddr;
								target.value = addrStr;

								// iframe을 넣은 element를 안보이게 한다.
								// (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
								element_layer.style.display = 'none';

								geocoder.addressSearch(data.address, function(results, status) { // 정상적으로 검색>이 완료됐으면
									if (status === daum.maps.services.Status.OK) {
										var result = results[0]; //첫번째 결과의 값을 활용 // 해당 주소에 대한 좌표>를 받아서
										var coords = new kakao.maps.LatLng(result.y, result.x); // 지도를 보여준다.
										//mapContainer.style.display = "block"; map.relayout(); // 지도 중심을 변경>한다.
										//map.setCenter(coords); // 마커를 결과값으로 받은 위치로 옮긴다.
										registerComplaintMap.setCenter(coords);
										_markerPosition = coords;
										registerComplaintMarker.setPosition(_markerPosition);
									}
								});
							},
							width : '100%',
							height : '100%',
							maxSuggestItems : 5
						}).embed(element_layer);
						// iframe을 넣은 element를 보이게 한다.
						element_layer.style.display = 'block';

						// iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
						//initLayerPosition();

						// 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
						// resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
						// 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
						var width = 90; //우편번호서비스가 들어갈 element의 width
						var height = 50; //우편번호서비스가 들어갈 element의 height
						var borderWidth = 5; //샘플에서 사용하는 border의 두께

						// 위에서 선언한 값들을 실제 element에 넣는다.
						element_layer.style.width = width + '%';
						element_layer.style.height = height + '%';
						element_layer.style.border = borderWidth + 'px solid';
						// 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
						//element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
						//element_layer.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
						element_layer.style.left = '4vw';
						element_layer.style.top = '10vh';

					}



// 마커 클러스터러를 생성합니
var initClusterer = function(map) {
	var clusterer = new kakao.maps.MarkerClusterer({
		map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
		averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
		minLevel: 8, // 클러스터 할 최소 지도 레벨 
		calculator: [2, 4, 6], // 클러스터의 크기 구분 값, 각 사이값마다 설정된 text나 style이 적용된다
		texts: getTexts, // texts는 ['삐약', '꼬꼬', '꼬끼오', '치멘'] 이렇게 배열로도 설정할 수 있다 
		styles: [{ // calculator 각 사이 값 마다 적용될 스타일을 지정한다
			width : '30px', height : '30px',
			background: 'rgba(51, 204, 255, .8)',
			borderRadius: '15px',
			color: '#000',
			textAlign: 'center',
			fontWeight: 'bold',
			lineHeight: '31px'
		},
			{
				width : '40px', height : '40px',
				background: 'rgba(255, 153, 0, .8)',
				borderRadius: '20px',
				color: '#000',
				textAlign: 'center',
				fontWeight: 'bold',
				lineHeight: '41px'
			},
			{
				width : '50px', height : '50px',
				background: 'rgba(255, 51, 204, .8)',
				borderRadius: '25px',
				color: '#000',
				textAlign: 'center',
				fontWeight: 'bold',
				lineHeight: '51px'
			},
			{
				width : '60px', height : '60px',
				background: 'rgba(255, 80, 80, .8)',
				borderRadius: '30px',
				color: '#000',
				textAlign: 'center',
				fontWeight: 'bold',
				lineHeight: '61px'
			}
		]
	});

	return clusterer;
}


// 클러스터 내부에 삽입할 문자열 생성 함수입니다 
function getTexts( count ) {

	return count;
	// 한 클러스터 객체가 포함하는 마커의 개수에 따라 다른 텍스트 값을 표시합니다 
	/*
	if(count < 2) {
		return '삐약';        
	} else if(count < 4) {
		return '꼬꼬';
	} else if(count < 6) {
		return '꼬끼오';
	} else {
		return '치멘';
	}
	*/
}
