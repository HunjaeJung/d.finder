
$(document).ready( function() {
  update_count();

  $("#search-keyword").keyup(function(event){
    search_start(event);
  })
});

// count 업데이트
function update_count() {
  $.ajax( {
    url: 'http://localhost:9200/dbx/file/_count',
    dataType:'json',
    type: 'get'
  }).done(function(data) {
    if (data != null) {
      html = "총 " + data.count + "개의 문서가 등록되어 있습니다.";
      $("#count_index").html(html);
    }
  }).error(function(e) {
    alert("error");
  });
}

function search_start(event){
  if(event.keyCode == 13){
      //if input is empty do nothing
      var search_keyword = $("#search-keyword").val();
      if(search_keyword.length==0){
        return;
      };

      //or checked box
      var checked = "&default_operator=OR";

      var start = new Date().getTime();
      
      $.ajax({
        url: 'http://localhost:9200/dbx/file/_search?q=*'+search_keyword+'*'+checked,
        dataType: 'jsonp',
        type: 'get'
      }).done(function(data){
        if(data!=null){
          var count = 0;
          var html = "<table class='table table-striped'><thead>";
          html += "<th width=40>순서</th>";
          html += "<th width=60>파일이름</th>";
          html += "<th width=50>구분</th>";
          html += "<th width=200>내용</th>";
          html += "<th width=150>생성시간</th></thead>";

          var end = new Date().getTime();
          var time = end - start;

          var html_count = "총 <b>" + data.hits.hits.length + "</b>개의 문서가 검색되었습니다.<br>" + (time/1000) + "초의 시간이 소요되었습니다.";
          $("#count_result").html(html_count);

          $.each(data.hits.hits, function(index, value) {
            count++;
            var docu_type = "문서";

            if (value["_source"]["text"] == "") { docu_type = "이미지"; }

            html += "<tr><td>" + count + "</td>";
            html += "<td>" + "<a href='../download/" + value["_source"]["resourceName"] + "' target=_blank>" + value["_source"]["title"] + "</a></td>";
            html += "<td>" + docu_type + "</td>";
            html += "<td>" + value["_source"]["text"] + "</td>";
            html += "<td>" + value["_source"]["created"] + "</td></tr>";
          });
          html += "</table>";
          $("#result_table").html(html);
        }
      })
  }   
}

(function() {

  var config = {
    app_id: '80884516050174413',
    debug: true,
    init_callback: function(){
      console.log('Branch SDK initialized!');
    }
  };

  // Begin Branch SDK //
  var Branch_Init=function(a){self=this,self.app_id=a.app_id,self.debug=a.debug,self.init_callback=a.init_callback,self
  .queued=[],this.init=function(){for(var a=["close","logout","track","identify","createLink","showReferrals","showCredits",
  "redeemCredits","appBanner"],b=0;b<a.length;b++)self[a[b]]=function(a){return function(){self.queued.push([a].concat(Array
  .prototype.slice.call(arguments,0)))}}(a[b])},self.init();var b=document.createElement("script");b.type="text/javascript",
  b.async=!0,b.src="https://bnc.lt/_r",document.getElementsByTagName("head")[0].appendChild(b),self._r=function(){if(
  void 0!==window.browser_fingerprint_id){var a=document.createElement("script");a.type="text/javascript",a.async=!0,a
  .src="https://s3-us-west-1.amazonaws.com/branch-web-sdk/branch-0.x.min.js",document.getElementsByTagName("head")[0].appendChild(a)
  }else window.setTimeout("self._r()",100)},self._r()};window.branch=new Branch_Init(config);
  // End Branch SDK //

})();

