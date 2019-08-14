using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MafiaMadness.Hubs
{
    public static class UserInfo
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
    }
    public class ChatHub : Hub
    {
        //this adds the connection ID, which is unique, but for now we want name (which might be dup)
        /*public override Task OnConnectedAsync()
        {
            UserInfo.ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception e)
        {
            UserInfo.ConnectedIds.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(e);
        } */

        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine("inside sendMessage");
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task sendDrawingPersistent(string user, string drawing)
        {
            Console.WriteLine("inside senddrawingPersistent");
            await Clients.All.SendAsync("ReceiveDrawingPersistent", user, drawing);
        }

        public async Task sendMouseDown(string user, string coordinates)
        {
            Console.WriteLine("inside sendMouseDown server");
            await Clients.All.SendAsync("ReceiveMouseDown", user, coordinates);
        }

        public async Task sendMouseMovement(string user, string coordinates)
        {
            Console.WriteLine("inside sendMouseMovement");
            await Clients.All.SendAsync("ReceiveMouseMovement", user, coordinates);
        }
        
        public async Task RequestUserCount(string name)
        {
            Console.WriteLine("inside request user count");
            UserInfo.ConnectedIds.Add(name);
            await Clients.All.SendAsync("ReceiveUserCount", UserInfo.ConnectedIds.Count);
        }
    }
}
