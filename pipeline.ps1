# DEPLOY demo-asia-d2

$groupName="agenaWapi"
$aksName="agenaAKSCluster"
$acrName="agenaCR"
$ipName="agenaAKSPublicIP"

az acr login --name $acrName
cd d:\work\repos\agenarisk\demo-asia-d2\
$deploymentName="demo-asia-d2"
$containerName="demo-asia-d2"
$imageVersion="0.3"
$imageName=-join("demo-asia-d2",":",$imageVersion)
$imageTag=-join($acrName,".azurecr.io/",$imageName).ToLower()
yarn build
docker build -f Dockerfile --force-rm=true --no-cache -t $imageTag .
docker push $imageTag

kubectl apply -f demo-asia-d2.yml

$patchRequest = @{spec = @{template = @{metadata = @{labels = @{date = ((((Get-Date -Format o)).replace(':','-').replace('+','_')))}}}}}
$patchJson = ((ConvertTo-Json -InputObject $patchRequest -Compress -Depth 10))
$patchJson = $patchJson.replace('"','\"')
kubectl patch deployment demo-asia-d2 --patch $patchJson
