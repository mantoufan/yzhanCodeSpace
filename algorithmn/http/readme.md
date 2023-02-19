## 七层网络协议
   物理层  
   数据链路层 Mac address  
  
   Internet protocol 网络层 IP  
  
   TCP  
   表示层  
   会话层  
   应用层  

## 数据流
   API:
   数据流：stream  
   write / end  
  
   Net:  
   net.createConnection  

## 请求
   请求行：METHOD + PATH + VERSINO  
   POST / HTTP 1.1  
  
   请求头：  
   Host: 127.0.0.1  
   Content-Type: application/x-www-form-urlencoded  
   (空行为标志结束)  

   请求体：   
   filed1=aaa&code=%3D1  

## 响应
   响应行：
   HTTP/1.1 200 OK  

   状态码：
   20x:ok
   30x:redirect
   40x:找不到 或 权限
   50x:服务端错误

   响应头：
   Transfer-Encoding: chunked 分片

## 状态函数是纯函数
   状态函数不是纯函数，可以有副作用（只能写，不能读），不能是闭包  
   确定的输入一定可以导致确定的状态迁移  