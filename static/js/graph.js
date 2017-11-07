queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);
    
     function makeGraphs(error, tdsData) {
         
        var ndx = crossfilter(tdsData);
        tdsData.forEach(function(d) {
            d.Age = parseInt(d.Age);
        })
    
        var gender_dim = ndx.dimension(dc.pluck('Gender'));
        var count = gender_dim.group();
    
        dc.barChart('#chart1')
            .height(300)
            .width(400)
            .margins({top:10, right:50, bottom:30, left:50})
            .dimension(gender_dim)
            .group(count)
            .valueAccessor(function(d){
                return (d.value/158)*100
            })
            
            .transitionDuration(500)
            .renderHorizontalGridLines(true)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Number of TD'S")
            .yAxis().ticks(10);
            
    
     var number_of_tds = ndx.groupAll();
    
    dc.numberDisplay("#chart2")
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return (+d);
        })
        .group(number_of_tds);  
        
    var average_age_tds = ndx.groupAll().reduce(
        function (p, v) {
            ++p.count;
            p.total += v.Age;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            --p.count;
            if (p.count === 0) {
                console.log("Zero")
                p.total = 0;
                p.average = 0;
            } else {
                p.total -= v.Age;
                p.average = p.total / p.count;
            };
            return p;
        },
        function () {
            return {count: 0, total: 0, average: 0};
        }
    );
    
 dc.numberDisplay("#chart3")
        .formatNumber(d3.format(".2f"))
        .valueAccessor(function (d) {
            
            return (d.average);
        })
        .group(average_age_tds)
   
   
  var total_age = ndx.groupAll().reduceSum(dc.pluck('Age'));
   
    var chart = dc.numberDisplay("#chart6");
    chart
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return (+d);
        })
        .group(total_age)
        
        
          var gender_dim = ndx.dimension(dc.pluck('Ethnicty'));
        var count_by_rank = gender_dim.group();
        
        dc.barChart('#chart4')
            .height(300)
            .width(400)
            .margins({top:10, right:50, bottom:30, left:50})
            .dimension(gender_dim)
            .group(count_by_rank)
            .transitionDuration(500)
            .renderHorizontalGridLines(true)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Number of TD'S")
            .yAxis().ticks(10);
            
   
  
  var genderColors = d3.scale.ordinal()
  .domain(["F","M"])
  .range(["pink","blue"]);
  
    var party_dim = ndx.dimension(function(d){
        return [d.Party,d.Age, d.Gender, d.Name]
    });
    
    var group = party_dim.group();
    var age_dim = ndx.dimension(dc.pluck('Age'));
    var minAge = age_dim.bottom(1)[0].age;
    var maxAge = age_dim.top(1)[0].age;
    
    dc.scatterPlot("#chart_s")
    .width(400)
    .height(400)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .symbolSize(8)
    .clipPadding(10)
    .yAxisLabel("Age")
    .xAxisLabel("Party")
    .title(function (d) {
        return d.key [3] + "(" + d.key[0] + ")";
    })
    .colorAccessor(function (d) {
        return d.key[2];
    })
    .colors(genderColors)
    .dimension(party_dim)
    .group(group)
    .margins({top:10, right:50, bottom:100, left:50})
    
     var partyname_dim = ndx.dimension(dc.pluck('Party'));
        var partyam = partyname_dim.group();
        
        dc.rowChart('#chart_d')
            .height(300)
            .width(500)
            .margins({top:10, right:50, bottom:30, left:50})
            .dimension(partyname_dim)
            .group(partyam)
            
            .transitionDuration(500)

      var consname_dim = ndx.dimension(dc.pluck('Constituency'));
      
      const consGroup = consname_dim.groupAll().reduce(
  (p, v) => { // add element
    const cat = v.Constituency;
    const count = p.constituencies.get(cat) ||  0;
    p.constituencies.set(cat, count + 1);
    return p;
  },

  (p, v) => { // remove element
    const cat = v.Constituency;
    const count = p.constituencies.get(cat);
    if (count === 1) {
      p.constituencies.delete(cat);
    } else {
      p.constituencies.set(cat, count - 1);
    }
    return p;
  },

  () => { // init
    return {
      constituencies: new Map()
    };
  });


dc.numberDisplay("#chart7")
  .group(consGroup)
  .valueAccessor(
    (d) => {
      return d.constituencies.size;
    }
  );
  
  var partyama_dim = ndx.dimension(dc.pluck('Party'));
      
      const partiesGroup = partyama_dim.groupAll().reduce(
  (p, v) => { // add element
    const cat = v.Party;
    const count = p.parties.get(cat) ||  0;
    p.parties.set(cat, count + 1);
    return p;
  },

  (p, v) => { // remove element
    const cat = v.Party;
    const count = p.parties.get(cat);
    if (count === 1) {
      p.parties.delete(cat);
    } else {
      p.parties.set(cat, count - 1);
    }
    return p;
  },

  () => { // init
    return {
      parties: new Map()
    };
  });


dc.numberDisplay("#chart8")
  .group(partiesGroup)
  .valueAccessor(
    (d) => {
      return d.parties.size;
    }
  );
       
           
        
    //     var cons_group = consname_dim.group().reduceSum();
    
    // var constituency_dim = ndx.dimension(dc.pluck('Constituency'))
    // var consname_count = constituency_dim.group().reduceCount(function(d) {
    //     return 0;
    // });
        
        
    // console.log(consname_count.all())
    
    // dc.numberDisplay("#chart7")
    //     .formatNumber(d3.format("d"))
    //     .valueAccessor(function (d) {
    //         return (+d.count);
    //     })
    //     .group(consname_count);
           
    //       var chart = dc.numberDisplay("#chart7");
    // chart
    //     .formatNumber(d3.format("d"))
    //     .valueAccessor(function (d) {
    //         return (+d);
    //     })
    //     .group(cons_group)
    
    
   

      var runDimension  = ndx.dimension(dc.pluck('Constituency'));
  var speedSumGroup = runDimension.group();
  var chart = dc.pieChart("#test");
  var colorScale = d3.scale.ordinal().range(['#A2E2E3','#fb9867','#f3e7f3','#c4e8f1','#76ced3','#262626','#e0281e','#f9d6d4','#e13528','#ffdebc','#ffd1ab']);


  
  
  chart
      .width(600)
      .height(500)
      .slicesCap(47)
      .innerRadius(100)
      .externalLabels(40)
      .externalRadiusPadding(50)
      .drawPaths(true)
      .dimension(runDimension)
      .group(speedSumGroup)
      .colors(colorScale)
      .transitionDuration(1500);


         
            
            
        
     dc.renderAll();

             }
              