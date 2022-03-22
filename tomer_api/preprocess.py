from torch_snippets import *
from torchvision import transforms as T


preprocess = T.Compose([
    T.Lambda(lambda x: torch.Tensor(x.copy()).permute(2, 0, 1).to(device))
])

normalize = lambda x: (x - 127.5)/127.5



def after_model(fake_trg):
    denorm = T.Normalize((-1, -1, -1), (2, 2, 2))
    img_sample = torch.cat([denorm(fake_trg[0])], -1)
    img_sample = img_sample.detach().cpu().permute(1,2,0).numpy()
    return img_sample
