//This code can run only using the Visualize Tool on Postman.com. The code in this file is actually a test of the incoming response. Please check the README to know more
var template = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Teko&display=swap" rel="stylesheet">
</head>
<body>
    <input type = "hidden" id = "durationFirstHalf" value = {{response.firstHalf.duration}} />
    <input type = "hidden" id = "durationSecondHalf" value = {{response.secondHalf.duration}} />
    <input type = "hidden" id = "heightFirstHalf" value = {{response.firstHalf.height}} />
    <input type = "hidden" id = "heightSecondHalf" value = {{response.secondHalf.height}} />
    <input type = "hidden" id = "namesFirstHalf" value = {{response.firstHalf.names}} />
    <input type = "hidden" id = "namesSecondHalf" value = {{response.secondHalf.names}} />
    <input type = "hidden" id = "colorFirstHalf" value = {{response.firstHalf.color}} />
    <input type = "hidden" id = "colorSecondHalf" value = {{response.secondHalf.color}} />
    <script>
        
        var data1 = document.getElementById("durationFirstHalf").value.split(',').map(x=>+x);
        var data2 = document.getElementById("durationSecondHalf").value.split(',').map(x=>+x);

        var height1 = document.getElementById("heightFirstHalf").value.split(',').map(x=>+x);
        var height2 = document.getElementById("heightSecondHalf").value.split(',').map(x=>+x);

        var names1 = document.getElementById("namesFirstHalf").value.split(',');       
        var names2 = document.getElementById("namesSecondHalf").value.split(','); 

        var color1 = document.getElementById("colorFirstHalf").value.split(',');
        var color2 = document.getElementById("colorSecondHalf").value.split(',');

        var data = data1;
        var height = height1; 
        var names = names1       
        var color = color1;
        var heightScale = d3.scaleLinear()
            .domain([0, 10])
            .range([35, 150]);
        
        var body = d3.select('body');
        body
            .style('background-color', '#383838')

        var dateAndTime = d3.select('body')
            .append('text')
            .attr('id', 'dateAndTime');
        var toggle = false;
        var button = d3.select('body')
            .append('div')
            .attr('id', 'toggle')
            .text('Next')
            .attr('style', 'border:solid 2px white;border-radius:2.7px;position:absolute;padding:7px;left:5px;top:38%;user-select:none;background-color:#383838;color:white;font:2.4em Teko;z-index:5');
        
        
        setInterval(showTime, 1000);
        function showTime(){
            var date = new Date().toLocaleDateString('en-UK', {weekday:'long',year:'numeric',month:'long',day:'numeric'});
            var time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true});
            document.getElementById('dateAndTime')
                .innerHTML = date + "<br>" + time;
            document.getElementById('dateAndTime').style.cssText = 'font:2em Teko;line-height:1em;color:white';
        }
        showTime();

        var canvas = d3.select('body')
            .append('svg')
                .attr('id', 'containerSVG')
                .attr('style', 'position:absolute;width:550px;height:320;top:20%;left:10%;background-color:#383838;');


        var group = canvas.append('g')
            .attr('id', 'mainGroup')
            .attr('style', 'transform:translate(35%, 50%)');



        var pie = d3.pie()
            .value(function(d,i){ return data[i]})
            .sort(null);


        var r = 100;
        var p = Math.PI * 2;

        var toolTip = d3.select('body')
            .append('span')
            .attr('id', 'tooltip')
            .attr('style', 'position:absolute;font:1.2em Teko;color:white;user-select:none')
            .style("opacity", "0")
            .style("padding", "7px")

        button.on('mouseover', function(){
            button
                .attr('style', 'border:solid;border-width:2px;border-color:white;border-radius:2.7px;position:absolute;padding:7px;left:5px;top:38%;user-select:none;background-color:white;color:#383838;font:2.4em Teko;z-index:5;transition-duration:0.3s')
        })
        button.on('mouseout', function(){
            button
                .attr('style', 'border:solid;border-width:2px;border-radius:2.7px;border-color:white;position:absolute;padding:7px;left:5px;top:38%;user-select:none;background-color:#383838;color:white;font:2.4em Teko;z-index:5;transition-duration:0.3s;')
        })
        button.on('click',  function(){
            canvas.selectAll('#legends').remove();
            canvas.selectAll('#Arc').remove();
            if(toggle == false){
                console.log('r');
                data = data1;
                height = height1;
                color = color1;
                names = names1;
                toggle = true;
                button.text('Next')
            }
            else{            
                data = data2;
                height = height2;
                color = color2;
                names = names2;
                toggle = false;
                button.text('Back')
            }

            var arcs = group.selectAll('.arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'arc')
                .attr('id', 'Arc');
                
            arcs
                .on('mouseover', function(e,d){
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .text(names[d.index])
                        .style("border", "solid")
                        .style("border-width", "1.5px")
                        .style("border-radius", "3px")
                        .style('border-color', 'white')
                })
                .on('mousemove', function(e,d) {
                    d3.select('#tooltip')
                    .style('left', (e.pageX+15) + 'px')
                    .style('top', (e.pageY+15) + 'px')
                    .style("border", "solid")
                    .style("border-width", "1.5px")
                    .style("border-radius", "3px")
                    .style('border-color', 'white')
                    })
                .on('mouseout', function() {
                    d3.select('#tooltip')
                    .style('opacity', 0)
                    .style("border", "solid")
                    .style("border-width", "1.5px")
                    .style("border-radius", "3px")
                    .style('border-color', 'white')
                    })
            arcs.append('path')
                .attr('fill', function(d, i){ return color[i]})
                .transition()
                    .delay(function(d, i) {
                    return i * 380;
                    })
                        .attrTween('d', function(d) {
                var interpolate = d3.interpolate((d.startAngle+0.1), d.endAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    var newArc = d3.arc()
                    .innerRadius(30)
                    .outerRadius(heightScale(height[d.index]))
                    .startAngle(d.startAngle)
                    .endAngle(d.endAngle)
                    .padAngle(.02)
                    .padRadius(80)
                    .cornerRadius(2)()
                    return newArc;
                }
                });
                        
                

            var legend = canvas.append('g')
                .attr('id', 'legends');

            legend.selectAll('mydots')
                .append('g')
                .attr('id', 'circles')
                .data(color)
                .enter()
                .append('circle').style('fill', function(d,i){return d;})
                    .attr('cx', 370).transition().duration(700)
                    .attr('cy', function(d,i){return 60 + i*32;})
                    .attr('r', 5)
                    
               
                    
            legend.selectAll("mylabels")
                .data(names)
                .enter()
                .append("text")
                    .attr('style', 'font: 1.3em Teko')
                    .style("fill", function(d,i){ return color[i]})
                    .attr("x", 390)
                    .transition().duration(700)
                    .attr("y", function(d,i){ return 60 + i*32}) 
                    
                    
                    .text(function(d){return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
                    
                })

        document.getElementById('toggle').click()

    </script>
</body>
</html>
`;

pm.visualizer.set(template,{response: pm.response.json()});
