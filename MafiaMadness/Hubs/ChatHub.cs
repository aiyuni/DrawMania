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
            Console.WriteLine("inside sendMessage");
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task sendDrawingPersistent(string user, string drawing)
        {
            Console.WriteLine("inside senddrawingPersistent");
            await Clients.All.SendAsync("ReceiveDrawingPersistent", user, drawing);
        }

        public async Task sendMouseMovement(string user, string coordinates)
        {
            Console.WriteLine("inside sendMouseMovement");
            await Clients.All.SendAsync("ReceiveMouseMovement", user, coordinates);
        }
    }
}
