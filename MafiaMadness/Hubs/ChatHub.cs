using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MafiaMadness.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task sendDrawingPersistent(string user, string drawing)
        {
            await Clients.All.SendAsync("ReceiveDrawingPersistent", user, drawing);
        }
    }
}
